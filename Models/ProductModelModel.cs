using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class ProductModelModel
{
    public int ProductModelId { get; set; }

    public string Name { get; set; } = null!;

    public string? CatalogDescription { get; set; }

    public Guid Rowguid { get; set; }

    public DateTime ModifiedDate { get; set; }

    

    
}
