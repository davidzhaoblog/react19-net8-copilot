using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureWorksLT2019.Shared
{
    public enum ErrorLogSeverity
    {
        Info = 0,
        Notice = 1,
        Warning = 2,
        Error = 3,
        Fatal = 4
    }

    public enum ErrorLogState
    {
        New = 0,
        InProgress = 1,
        Resolved = 2,
        Closed = 3
    }
}
