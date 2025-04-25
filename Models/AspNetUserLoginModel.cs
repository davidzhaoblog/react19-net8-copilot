using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class AspNetUserLoginModel
{
    public string LoginProvider { get; set; } = null!;

    public string ProviderKey { get; set; } = null!;

    public string? ProviderDisplayName { get; set; }

    public string UserId { get; set; } = null!;

    
}
