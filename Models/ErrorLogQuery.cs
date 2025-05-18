using AdventureWorksLT2019.Shared;

namespace AdventureWorksLT2019.Models
{
    public class ErrorLogQuery : BaseQuery
    {
        public string? Text { get; set; } // For UserName, ErrorMessage, ErrorProcedure
        public DateTime? ErrorTimeFrom { get; set; }
        public DateTime? ErrorTimeTo { get; set; }
        public List<int>? ErrorSeverities { get; set; }
        public List<int>? ErrorStates { get; set; }
    }
}
