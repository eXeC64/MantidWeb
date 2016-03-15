#pragma once

#include <MantidAPI/AlgorithmObserver.h>

/*
 * Custom algorithm observer that calls the provided callbacks
 */
class CallbackAlgorithmObserver : public Mantid::API::AlgorithmObserver
{
public:
  CallbackAlgorithmObserver(
    int id,
    Mantid::API::IAlgorithm_sptr alg,
    std::function<void(int)> startCB,
    std::function<void(int)> stopCB,
    std::function<void(int, double, const std::string&)> progressCB,
    std::function<void(int, const std::string&)> errorCB)
  : m_id(id)
  , m_alg(alg)
  , m_startCB(startCB)
  , m_stopCB(stopCB)
  , m_progressCB(progressCB)
  , m_errorCB(errorCB)
  {
    observeAll(m_alg);
  }

  virtual ~CallbackAlgorithmObserver()
  {
    stopObserving(m_alg);
  }

  virtual void progressHandle(const Mantid::API::IAlgorithm*, double p, const std::string &msg)
  {
    m_progressCB(m_id, p, msg);
  }

  virtual void startHandle(const Mantid::API::IAlgorithm*)
  {
    m_startCB(m_id);
  }

  virtual void finishHandle(const Mantid::API::IAlgorithm*)
  {
    m_stopCB(m_id);
  }

  virtual void errorHandle(const Mantid::API::IAlgorithm*, const std::string &what)
  {
    m_errorCB(m_id, what);
  }

private:
  int m_id;
  Mantid::API::IAlgorithm_sptr m_alg;
  std::function<void(int)> m_startCB;
  std::function<void(int)> m_stopCB;
  std::function<void(int, double, const std::string&)> m_progressCB;
  std::function<void(int, const std::string&)> m_errorCB;
};

