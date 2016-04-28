#include "Graph.hpp"

#include <algorithm>
#include <string>

std::string Graph::Title() const
{
  return m_title;
}

std::set<std::string> Graph::Curves() const
{
  std::set<std::string> ret;
  for(auto it : m_curves)
    ret.insert(it.first);
  return ret;
}

std::string Graph::CurveLabel(const std::string& name) const
{
  auto it = m_curves.find(name);
  if(it != m_curves.end())
    return it->second.label;

  return "Invalid Curve";
}

std::string Graph::CurveColor(const std::string& name) const
{
  auto it = m_curves.find(name);
  if(it != m_curves.end())
    return it->second.color;
  return "#000000";
}

void Graph::SetTitle(const std::string& title)
{
  m_title = title;
}

void Graph::AddCurve(const std::string& name)
{
  auto it = m_curves.find(name);
  if(it != m_curves.end())
    return;

  m_curves.insert({name, CurveProperties{name, "#000000"}});
}

void Graph::RemoveCurve(const std::string& name)
{
  auto it = m_curves.find(name);
  if(it != m_curves.end())
    m_curves.erase(it);
}


void Graph::SetCurveLabel(const std::string& name, const std::string& label)
{
  auto it = m_curves.find(name);
  if(it == m_curves.end())
    return;

  it->second.label = label;
}

void Graph::SetCurveColor(const std::string& name, const std::string& color)
{
  auto it = m_curves.find(name);
  if(it == m_curves.end())
    return;

  it->second.color = color;
}
