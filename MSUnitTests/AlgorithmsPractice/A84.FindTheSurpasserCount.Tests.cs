namespace AdventureWorksLT2019.MSUnitTests.AlgorithmsPractice.A84;

/*
# Find surpasser count for each array element

Given an integer array having distinct elements, 
find the surpasser count for each element in it.
In other words, for each array element, 
find the total number of elements to its right, which are greater than it.

For example,

Input:  { 4, 6, 3, 9, 7, 10 } Output: { 4, 3, 3, 1, 1, 0 }
*/

public class FindTheSurpasserCount
{
    // O(n log n)
    public int[] DoCopilot(int[] input)
    {
        var result = new int[input.Length];
        var sorted = new SortedList<int, int>();
        for (int i = input.Length - 1; i >= 0; i--)
        {
            sorted.Add(input[i], i);
            result[i] = sorted.Count - sorted.IndexOfKey(input[i]) - 1;
        }
        return result;
    }

    // O(n^2)
    public int[] DoManually(int[] input)
    {
        var result = new int[input.Length];
        for (int i = 0; i < input.Length - 1; i++)
        {
            for (int j = i + 1; j < input.Length; j++)
            {
                if (input[i] < input[j])
                {
                    result[i]++;
                }
            }
        }
        return result;
    }
}

[TestClass]
public sealed class FindTheSurpasserCountTests
{
    [TestMethod]
    public void FindTheSurpasserCount_DoManually()
    {
        var solution = new FindTheSurpasserCount();
        int[] input = { 4, 6, 3, 9, 7, 10 };
        var result = solution.DoManually(input);
        int[] expected = { 4, 3, 3, 1, 1, 0 };

        CollectionAssert.AreEqual(result, expected);
    }

    [TestMethod]
    public void FindTheSurpasserCount_DoCopilot()
    {
        var solution = new FindTheSurpasserCount();
        int[] input = { 4, 6, 3, 9, 7, 10 };
        var result = solution.DoCopilot(input);
        int[] expected = { 4, 3, 3, 1, 1, 0 };

        CollectionAssert.AreEqual(result, expected);
    }
}
