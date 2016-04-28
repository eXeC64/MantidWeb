#pragma once

#include <unordered_map>
#include <set>
#include <string>

struct CurveProperties
{
  std::string label;
  std::string color;
};

class Graph
{
public:
  std::string Title() const;
  std::set<std::string> Curves() const;
  std::string CurveLabel(const std::string& name) const;
  std::string CurveColor(const std::string& name) const;

  void SetTitle(const std::string& title);

  void AddCurve(const std::string& name);
  void RemoveCurve(const std::string& name);
  void SetCurveLabel(const std::string& name, const std::string& label);
  void SetCurveColor(const std::string& name, const std::string& color);

private:
  std::string m_title = "Untitled Graph";
  std::unordered_map<std::string, CurveProperties> m_curves;
};
