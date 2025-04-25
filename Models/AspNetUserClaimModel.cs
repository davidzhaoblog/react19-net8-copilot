using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class AspNetUserClaimModel
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string? ClaimType { get; set; }

    public string? ClaimValue { get; set; }

    
}
