using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class VProductAndDescriptionModel
{
    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string ProductModel { get; set; } = null!;

    public string Culture { get; set; } = null!;

    public string Description { get; set; } = null!;
}
