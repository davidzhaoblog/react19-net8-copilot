namespace AdventureWorksLT2019.XUnitTests.CSharpTests;

public class UnitTest_keywords
{
    [Fact]
    public void Test_keyword_as()
    {
        object a = 123;
        var b = a as string;
    }
}