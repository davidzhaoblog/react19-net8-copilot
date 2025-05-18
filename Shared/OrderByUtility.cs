using System;
using System.Collections.Generic;
using System.Linq;

namespace AdventureWorksLT2019.Shared
{
    public static class OrderByUtility
    {
        public static string? ParseOrderBy(string? orderBy)
        {
            if (string.IsNullOrEmpty(orderBy))
                return null;

            var orderByArray = orderBy.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            var orderByString = ParseOrderBy(orderByArray);
            return orderByString;
        }


        /// <summary>
        /// Parses the OrderBy array and returns a valid string for DynamicLinq's OrderBy.
        /// </summary>
        public static string? ParseOrderBy(string[]? orderByArray)
        {
            if (orderByArray == null || orderByArray.Length == 0)
                return null;

            var orderClauses = new List<string>();
            foreach (var item in orderByArray)
            {
                if (string.IsNullOrWhiteSpace(item)) continue;
                var parts = item.Split('~', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                if (parts.Length != 2) continue;

                var column = parts[0];
                var direction = parts[1].Equals("Descending", StringComparison.OrdinalIgnoreCase) ? "descending" : "ascending";
                // DynamicLinq expects: "ColumnName descending" or "ColumnName"
                orderClauses.Add(direction == "ascending" ? column : $"{column} {direction}");
            }
            return orderClauses.Count > 0 ? string.Join(", ", orderClauses) : null;
        }
    }
}
