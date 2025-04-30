namespace AdventureWorksLT2019.XUnitTests.CSharpTests;

public class UnitTest_CsharpFeatures
{
    [Fact]
    public void Test_CSharpFeatures_boxing_unboxing()
    {
        {
            object a = "123";
            var b = a as int?;
        }
        {
            int aa = 123;
            object bb = aa;
            int aa1 = (int)bb;
        }
        {

            object bb = null;
            int aa1 = (int)bb;
        }
    }
}