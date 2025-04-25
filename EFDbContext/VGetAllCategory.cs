using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.EFDbContext;

public partial class VGetAllCategory
{
    public string ParentProductCategoryName { get; set; } = null!;

    public string? ProductCategoryName { get; set; }

    public int? ProductCategoryId { get; set; }
}
