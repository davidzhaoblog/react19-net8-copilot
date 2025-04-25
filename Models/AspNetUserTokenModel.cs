using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class AspNetUserTokenModel
{
    public string UserId { get; set; } = null!;

    public string LoginProvider { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Value { get; set; }

    
}
