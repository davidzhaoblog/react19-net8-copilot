namespace AdventureWorksLT2019.Shared
{
    public class BaseQuery
    {
        public int PageSize { get; set; } = 20;
        public int PageIndex { get; set; } = 0;
        public string? OrderBy { get; set; }
    }
}
