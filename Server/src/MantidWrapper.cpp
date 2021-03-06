#include "MantidWrapper.hpp"

#include <MantidAPI/AlgorithmFactory.h>
#include <MantidAPI/AlgorithmManager.h>
#include <MantidAPI/AnalysisDataService.h>
#include <MantidAPI/FrameworkManager.h>
#include <MantidAPI/FunctionFactory.h>
#include <MantidAPI/IPeakFunction.h>
#include <MantidDataObjects/Workspace2D.h>
#include <MantidKernel/UsageService.h>

#include <boost/algorithm/string.hpp>

namespace
{
  std::string normaliseCategory(std::string category) {
    boost::replace_all(category, "\\", "/");
    return category;
  }
}

MantidWrapper::MantidWrapper()
 : m_deleteObserver(*this,&MantidWrapper::DeleteEvent)
 , m_addObserver(*this,&MantidWrapper::AddEvent)
 , m_replaceObserver(*this,&MantidWrapper::ReplaceEvent)
 , m_renameObserver(*this,&MantidWrapper::RenameEvent)
 , m_clearObserver(*this,&MantidWrapper::ClearEvent)
{
  Mantid::Kernel::UsageService::Instance().setApplication("mantidweb");
  Mantid::API::FrameworkManager::Instance();
  Mantid::API::AnalysisDataService::Instance();

  //Subscribe to ADS events
  auto& notificationCenter = Mantid::API::AnalysisDataService::Instance().notificationCenter;
  notificationCenter.addObserver(m_deleteObserver);
  notificationCenter.addObserver(m_addObserver);
  notificationCenter.addObserver(m_replaceObserver);
  notificationCenter.addObserver(m_renameObserver);
  notificationCenter.addObserver(m_clearObserver);
}

json MantidWrapper::GetWorkspaces()
{
  json wsList = json::object();

  auto& ads = Mantid::API::AnalysisDataService::Instance();
  const auto& workspaces = ads.topLevelItems();
  for(auto it = workspaces.begin(); it != workspaces.end(); ++it)
    wsList[it->first] = GetWorkspaceDetails(it->first);

  //Flush any renames we don't need to worry about anymore
  m_recentRenames.clear();

  return wsList;
}

json MantidWrapper::GetWorkspaceDetails(const std::string& name)
{
  auto& ads = Mantid::API::AnalysisDataService::Instance();
  if(!ads.doesExist(name))
    return json::object();

  auto ws = ads.retrieveWS<Mantid::API::Workspace>(name);

  json wsItem;
  wsItem["name"] = name;
  wsItem["type"] = ws->id();
  wsItem["title"] = ws->getTitle();
  wsItem["children"] = json::object();

  if(ws->id() == "Workspace2D")
  {
    auto ws2D = ads.retrieveWS<Mantid::DataObjects::Workspace2D>(name);
    wsItem["numBins"] = ws2D->blocksize();
    wsItem["numHistograms"] = ws2D->getNumberHistograms();
  }
  else if(ws->id() == "WorkspaceGroup")
  {
    //Add children
    auto gws = ads.retrieveWS<Mantid::API::WorkspaceGroup>(name);
    std::vector<std::string> names = gws->getNames();
    for(std::string cname : names)
    {
      //If a rename has just happened, the group may not know yet.
      if(m_recentRenames.find(cname) != m_recentRenames.end())
      {
        std::string newName = m_recentRenames[cname];
        m_recentRenames.erase(cname);
        cname = newName;
      }

      auto cws = ads.retrieveWS<Mantid::API::Workspace>(cname);
      wsItem["children"][cname] = GetWorkspaceDetails(cname);
    }
  }

  return wsItem;
}

json MantidWrapper::GetUsableAlgorithms()
{
  auto& algFactory = Mantid::API::AlgorithmFactory::Instance();
  auto algDescs = algFactory.getDescriptors();

  json algorithms = json::array();

  std::set<std::string> seen;

  for(auto& desc : algDescs)
  {
    //Don't offer blacklisted algorithms
    if(IsAlgorithmBlacklisted(desc.name))
      continue;

    std::string key = desc.name + "-v" + std::to_string(desc.version);

    if(seen.find(key) != seen.end())
      continue;

    seen.emplace(std::move(key));

    json algorithm;
    algorithm["name"] = desc.name;
    algorithm["version"] = desc.version;
    algorithm["category"] = normaliseCategory(desc.category);
    algorithms.push_back(std::move(algorithm));
  }
  return algorithms;
}

json MantidWrapper::GetAlgorithms()
{
  json algorithms = json::object();

  for(auto it : m_algorithms)
    algorithms[std::to_string(it.first)] = GetAlgorithmDetails(it.first);

  return algorithms;
}

json MantidWrapper::GetAlgorithmSummary(int algorithm)
{
  json summary;

  auto it = m_algorithms.find(algorithm);
  if(it == m_algorithms.end())
    return summary;

  auto alg = it->second;

  summary["id"] = it->first;
  summary["name"] = alg->name();
  summary["version"] = alg->version();
  summary["category"] = normaliseCategory(alg->category());

  if(alg->isRunning())
    summary["state"] = "running";
  else if(alg->isExecuted())
    summary["state"] = "completed";
  else if(alg->isInitialized())
    summary["state"] = "ready";
  else
    summary["state"] = "other";

  summary["progress"] = summary["state"] == "completed" ? 1.0 : 0.0;
  summary["message"] = "";
  summary["error"] = "";

  return summary;
}

json MantidWrapper::GetAlgorithmDetails(int algorithm)
{
  json details;
  auto it = m_algorithms.find(algorithm);

  if(it != m_algorithms.end())
  {
    auto alg = it->second;
    details = GetAlgorithmSummary(algorithm);

    details["properties"] = GetAlgorithmProperties(algorithm);
  }

  return details;
}

json MantidWrapper::GetAlgorithmProperties(int algorithm)
{
  json props;

  auto it = m_algorithms.find(algorithm);
  if(it != m_algorithms.end())
  {
    auto alg = it->second;
    const std::vector<Mantid::Kernel::Property*>& algProps = alg->getProperties();

    for(auto prop : algProps)
    {
      json jprop;
      jprop["name"] = prop->name();
      jprop["type"] = prop->type();

      //Don't publish junk values
      if(!prop->isDefault() ||
         (prop->value() != "2147483647"
         && prop->value() != "8.9884656743115785e+307"))
      {
        jprop["value"] = prop->value();
      }
      jprop["help"] = prop->documentation();
      jprop["group"] = prop->getGroup();
      jprop["values"] = prop->allowedValues();
      jprop["error"] = prop->isValid();
      props.push_back(jprop);
    }
  }

  return props;
}

json MantidWrapper::GetCurves()
{
  json curveList = json::object();

  auto& ads = Mantid::API::AnalysisDataService::Instance();
  const auto& workspaces = ads.topLevelItems();
  for(auto it = workspaces.begin(); it != workspaces.end(); ++it)
  {
    Mantid::API::Workspace_sptr ws = it->second;

    if(ws->id() == "Workspace2D")
    {
      auto ws2D = ads.retrieveWS<Mantid::DataObjects::Workspace2D>(it->first);
      const int numHist = ws2D->getNumberHistograms();
      const int numBins = ws2D->blocksize();
      for(int i = 0; i < numHist; ++i)
      {
        const std::string name = it->first + "-" + std::to_string(i);
        json item;
        item["name"] = name;
        item["workspace"] = it->first;
        item["description"] = it->first + " Spectra " + std::to_string(i);
        item["numBins"] = numBins;

        curveList[name] = std::move(item);
      }
    }
    //TODO deal with id == WorkspaceGroup
  }

  return curveList;
}

json MantidWrapper::GetCurveData(const std::string& name)
{
  return json::object();
}

int MantidWrapper::CreateAlgorithm(const std::string& name, int version)
{
  if(IsAlgorithmBlacklisted(name))
  {
    std::cerr << "User attempted to create blacklisted algorithm. This should "
                 "never happen. Algorithm: " << name << std::endl;
    return 0;
  }

  auto& algMgr = Mantid::API::AlgorithmManager::Instance();

  try
  {
    auto alg = algMgr.create(name, version);
    alg->initialize();
    alg->setAlwaysStoreInADS(true);
    std::cout << "Created " << name << "-v" << version << std::endl;
    int id = NewAlgorithmId();
    std::cout << "Given id: " << id << std::endl;

    std::unique_ptr<CallbackAlgorithmObserver> observer(new CallbackAlgorithmObserver(
      id,
      alg,
      [this](int alg)
      {
        this->StartEvent(alg);
      },
      [this](int alg)
      {
        this->StopEvent(alg);
      },
      [this](int alg, double prog, const std::string& msg)
      {
        this->ProgressEvent(alg, prog, msg);
      },
      [this](int alg, const std::string& err)
      {
        this->ErrorEvent(alg, err);
      }
    ));

    m_algorithms[id] = alg;
    m_algObservers[id] = std::move(observer);
    return id;
  }
  catch(std::exception &e)
  {
    std::cout << "Error creating algorithm: " << name << "-v" << version << std::endl;
    std::cout << e.what() << std::endl;
    return 0;
  }
}

bool MantidWrapper::DeleteAlgorithm(int algorithm)
{
  if(m_algorithms.find(algorithm) == m_algorithms.end())
    return false;

  //If it's running, cancel it
  m_algorithms[algorithm]->cancel();
  //Delete the algorithm
  m_algorithms.erase(algorithm);
  return true;
}

json MantidWrapper::SetAlgorithmProperty(int algorithm,
                                        const std::string& property,
                                        const std::string& value)
{
  json data;

  if(m_algorithms.find(algorithm) == m_algorithms.end())
    return data;

  auto alg = m_algorithms[algorithm];

  if(!alg->existsProperty(property))
    return data;

  Mantid::Kernel::Property* prop = alg->getPointerToProperty(property);

  prop->setValue(value);

  data["value"] = value;
  data["error"] = prop->isValid();

  return data;
}

bool MantidWrapper::RunAlgorithm(int algorithm)
{
  if(m_algorithms.find(algorithm) == m_algorithms.end())
    return false;

  std::cout << "pre-run" << std::endl;
  this->m_algorithms[algorithm]->executeAsync();
  std::cout << "post-run" << std::endl;

  return true;
}

bool MantidWrapper::DeleteWorkspace(const std::string& name)
{
  auto& ads = Mantid::API::AnalysisDataService::Instance();
  if(!ads.doesExist(name))
    return false;

  ads.remove(name);

  return true;
}

bool MantidWrapper::RenameWorkspace(const std::string& name, const std::string& newName)
{
  auto& ads = Mantid::API::AnalysisDataService::Instance();
  if(!ads.doesExist(name))
    return false;

  ads.rename(name, newName);

  return false;
}

bool MantidWrapper::LoadWorkspace(const std::string& name, const std::string& path)
{
  auto& algMgr = Mantid::API::AlgorithmManager::Instance();

  try
  {
    auto alg = algMgr.create("Load");
    alg->initialize();
    alg->setAlwaysStoreInADS(true);
    alg->setProperty("Filename", path);
    alg->setProperty("OutputWorkspace", name);
    alg->execute();

    return true;
  }
  catch(std::exception &e)
  {
    std::cerr << "Error loading file: " << path << std::endl;
    std::cerr << e.what() << std::endl;
  }
  return false;
}

bool MantidWrapper::SaveWorkspace(const std::string& name, const std::string& path)
{
  auto& algMgr = Mantid::API::AlgorithmManager::Instance();

  try
  {
    auto alg = algMgr.create("SaveNexus");
    alg->initialize();
    alg->setProperty("Filename", path);
    alg->setProperty("InputWorkspace", name);
    alg->execute();

    return true;
  }
  catch(std::exception &e)
  {
    std::cerr << "Error saving file: " << path << std::endl;
    std::cerr << e.what() << std::endl;
  }
  return false;
}

int MantidWrapper::NewAlgorithmId()
{
  int id = 1;
  while(m_algorithms.find(id) != m_algorithms.end() || id < 0)
  {
    if(id < 0)
      id = 0;
    ++id;
  }
  return id;
}

bool MantidWrapper::IsAlgorithmBlacklisted(const std::string& name) const
{
  //block all load algorithms
  if(name.find("Load") == 0)
    return true;

  //block all save algorithms
  if(name.find("Save") == 0)
    return true;

  //there's a couple of algorithms for importing data from disk
  if(name.find("Import") == 0)
    return true;

  //only algorithm with Export at the start of its name exports to a workspace,
  //so it doesn't need blacklisting

  return false;
}

void MantidWrapper::DeleteEvent(Mantid::API::WorkspacePreDeleteNotification_ptr pNf)
{
  std::cout << "workspace deleted:" << pNf->objectName() << std::endl;
  m_deleteHandler(pNf->objectName());
}

void MantidWrapper::AddEvent(Mantid::API::WorkspaceAddNotification_ptr pNf)
{
  std::cout << "workspace added:" << pNf->objectName() << std::endl;
  m_addHandler(pNf->objectName());
}

void MantidWrapper::ReplaceEvent(Mantid::API::WorkspaceAfterReplaceNotification_ptr pNf)
{
  std::cout << "workspace replaced:" << pNf->objectName() << std::endl;
  m_replaceHandler(pNf->objectName());
}

void MantidWrapper::RenameEvent(Mantid::API::WorkspaceRenameNotification_ptr pNf)
{
  std::cout << "workspace renamed:" << pNf->objectName() << " -> " << pNf->newObjectName() << std::endl;

  //HACK: We log the recent renames so in the next AlgorithmList call, groups
  //have had their children renamed correctly.

  m_recentRenames[pNf->objectName()] = pNf->newObjectName();

  m_renameHandler(pNf->objectName(), pNf->newObjectName());
}

void MantidWrapper::ClearEvent(Mantid::API::ClearADSNotification_ptr)
{
  std::cout << "workspaces cleared" << std::endl;
  m_clearHandler();
}

void MantidWrapper::StartEvent(int alg)
{
  std::cout << "algorithm started:" << alg << std::endl;
  m_startHandler(alg);
}

void MantidWrapper::StopEvent(int alg)
{
  std::cout << "algorithm stopped:" << alg << std::endl;
  m_stopHandler(alg);
}

void MantidWrapper::ProgressEvent(int alg, double prog, const std::string& msg)
{
  std::cout << "algorithm progressed:" << alg << " " << prog * 100 << "% " << msg << std::endl;
  m_progressHandler(alg, prog, msg);
}

void MantidWrapper::ErrorEvent(int alg, const std::string& error)
{
  std::cout << "algorithm failed:" << alg << " " << error << std::endl;
  m_errorHandler(alg, error);
}

void MantidWrapper::SetWorkspaceAddedHandler(std::function<void(const std::string&)> cb)
{
  m_addHandler = cb;
}

void MantidWrapper::SetWorkspaceDeletedHandler(std::function<void(const std::string&)> cb)
{
  m_deleteHandler = cb;
}

void MantidWrapper::SetWorkspaceReplacedHandler(std::function<void(const std::string&)> cb)
{
  m_replaceHandler = cb;
}

void MantidWrapper::SetWorkspaceRenamedHandler(std::function<void(const std::string&, const std::string&)> cb)
{
  m_renameHandler = cb;
}

void MantidWrapper::SetWorkspacesClearedHandler(std::function<void()> cb)
{
  m_clearHandler = cb;
}

void MantidWrapper::SetAlgorithmStartedHandler(std::function<void(int)> cb)
{
  m_startHandler = cb;
}

void MantidWrapper::SetAlgorithmFinishedHandler(std::function<void(int)> cb)
{
  m_stopHandler = cb;
}

void MantidWrapper::SetAlgorithmProgressHandler(std::function<void(int, double, const std::string&)> cb)
{
  m_progressHandler = cb;
}

void MantidWrapper::SetAlgorithmErrorHandler(std::function<void(int, const std::string&)> cb)
{
  m_errorHandler = cb;
}
