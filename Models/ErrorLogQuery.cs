using AdventureWorksLT2019.Shared;

namespace AdventureWorksLT2019.Models
{
    public class ErrorLogQuery : BaseQuery
    {
        public string? Text { get; set; } // For UserName, ErrorMessage, ErrorProcedure, Note
        public DateTime? ErrorTimeFrom { get; set; }
        public DateTime? ErrorTimeTo { get; set; }
        public List<ErrorLogSeverity>? ErrorSeverities { get; set; }
        public List<ErrorLogState>? ErrorStates { get; set; }

        // New range criteria for LastUpdated
        public DateTime? LastUpdatedFrom { get; set; }
        public DateTime? LastUpdatedTo { get; set; }


        public List<string>? AssignedToUsers { get; set; }
    }
}
