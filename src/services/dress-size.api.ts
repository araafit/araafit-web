import apiClient from "../lib/axios";

// Wrapper type for API responses
interface ApiResponse<T> {
  data: T;
}

export type GenderSizeChartResponse = Record<
  string,
  Array<{ id: string; value: number }> | Array<{ name: string; hex: string }>
>;

class DressSizeApi {
  async getSizeChart(gender?: string): Promise<GenderSizeChartResponse> {
    const response = await apiClient.get<ApiResponse<GenderSizeChartResponse>>(
      `/size-chart/dress-sizes/${gender}`
    );
    return response.data.data;
  }
}

export const dressSizeApi = new DressSizeApi();
