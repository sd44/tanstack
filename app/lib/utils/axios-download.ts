import axios from 'redaxios';

interface BlobResponse {
  data: Blob; // The response data is expected to be a Blob
  // Headers are typically Record<string, string>, but might vary.
  // Using Record<string, any> or Record<string, string | undefined> can be safer
  // depending on how headers are accessed and what redaxios guarantees.
  // Let's assume lowercased string keys and string values for simplicity here.
  headers: Record<string, string>;
  status: number; // Include other properties you might need
  // Add other relevant properties from the actual response object if used
}

export async function postData(api: string, dataToSend: Record<string, unknown>) {
  try {
    const response = await axios.post<Blob>(
      api, // 你的 API 端点
      dataToSend, // 要 POST 的数据，axios 会自动处理 JSON.stringify
      {
        // **关键配置：** 告诉 axios 期望接收一个 Blob 对象
        responseType: 'blob',
        headers: {
          // axios 通常会自动设置，但明确指定也是好的
          'Content-Type': 'application/json',
          // 如果需要认证，添加 Authorization 头
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        // 可选：监听下载进度
        // onDownloadProgress: (progressEvent) => {
        //   if (progressEvent.total) {
        //      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //      console.log(`下载进度: ${percentCompleted}%`);
        //      // 在这里更新你的 UI 进度条
        //   }
        // },
      },
    );
    return response as unknown as BlobResponse; // Use type assertion carefully
  } catch (error) {
    console.error('Axios 下载错误:', error);
    return undefined;
  }
}

export async function downloadFileWithAxios(response: BlobResponse) {
  try {
    // 1. 从响应头获取文件名
    // axios 将响应头放在 response.headers 中 (通常是小写键)
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'downloaded_file'; // 默认文件名
    if (contentDisposition) {
      // 尝试从 Content-Disposition 头中提取文件名
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
      if (filenameMatch && filenameMatch[1]) {
        try {
          // 尝试解码被 URL 编码的文件名 (服务器端可能做了编码)
          filename = decodeURIComponent(filenameMatch[1]);
        } catch (e) {
          // 解码失败，使用原始匹配值
          filename = filenameMatch[1];
          console.warn('无法解码文件名，使用原始值:', filename);
        }
      }
    }

    // 2. 获取 Blob 数据
    // 当 responseType: 'blob' 时, response.data 就是 Blob 对象
    const blob = response.data;

    // 3. 创建指向 Blob 的临时 URL
    const url = window.URL.createObjectURL(blob);

    // 4. 创建隐藏的 <a> 标签来触发下载
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // 设置下载的文件名
    document.body.appendChild(link);

    // 5. 模拟点击
    link.click();

    // 6. 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`文件 "${filename}" 已开始下载。`);
    // 可以给用户成功的反馈
  } catch (error) {
    console.log('下载过程中发生未知错误。' + JSON.stringify(error));
  }
}

// --- 如何使用 ---
// const dataToSend = { documentId: 'abc-123', format: 'pdf' };
// downloadFileWithAxios(dataToSend);
