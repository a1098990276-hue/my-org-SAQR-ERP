using System;
using System.Collections.Generic;
using System.Text;

namespace Config
{
    public class AppSettings
    {
        public string DatabasePath { get; set; }
        public string PythonServicePath { get; set; }
        public int PythonServicePort { get; set; }
        public string LogLevel { get; set; }
        public string Theme { get; set; }
        public string Language { get; set; }
    }
}