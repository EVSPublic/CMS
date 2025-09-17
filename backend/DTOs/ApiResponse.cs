namespace AdminPanel.DTOs;

public class ApiResponse<T>
{
    public bool Ok { get; set; } = true;
    public T? Data { get; set; }
    public ApiError? Error { get; set; }
    public PaginationMeta? Meta { get; set; }

    public static ApiResponse<T> Success(T data, PaginationMeta? meta = null)
    {
        return new ApiResponse<T>
        {
            Ok = true,
            Data = data,
            Meta = meta
        };
    }

    public static ApiResponse<T> Failure(string code, string message, object? details = null)
    {
        return new ApiResponse<T>
        {
            Ok = false,
            Error = new ApiError
            {
                Code = code,
                Message = message,
                Details = details
            }
        };
    }
}

public class ApiError
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Details { get; set; }
    public string? TraceId { get; set; }
}

public class PaginationMeta
{
    public int Page { get; set; } = 1;
    public int PerPage { get; set; } = 20;
    public int Total { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / PerPage);
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PerPage { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}