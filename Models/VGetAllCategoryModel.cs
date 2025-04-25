using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class VGetAllCategoryModel
{
    public string ParentProductCategoryName { get; set; } = null!;

    public string? ProductCategoryName { get; set; }

    public int? ProductCategoryId { get; set; }
}
