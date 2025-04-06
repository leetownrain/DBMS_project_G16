import httpx

async def get_request(url: str, params: dict = None, headers: dict = None, timeout: float = 10.0):
    """
    萬用的非同步 GET 請求函式，可用來發送各種 GET 請求。

    :param url: 請求的 URL
    :param params: URL 查詢參數 (可選)
    :param headers: 請求標頭 (可選)
    :param timeout: 請求逾時時間，預設為 10 秒 (可選)
    :return: HTTP 回應物件 (httpx.Response)
    """
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(url, params=params, headers=headers)
    return response

async def post_request(url: str, params: dict = None, data: dict = None, json: dict = None, headers: dict = None, timeout: float = 10.0):
    """
    萬用的非同步 POST 請求函式，可用來發送各種 POST 請求。

    :param url: 請求的 URL
    :param params: URL 查詢參數 (可選)
    :param data: 傳送的表單資料 (可選)
    :param json: 傳送的 JSON 資料 (可選)
    :param headers: 請求標頭 (可選)
    :param timeout: 請求逾時時間，預設為 10 秒 (可選)
    :return: HTTP 回應物件 (httpx.Response)
    """
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, params=params, data=data, json=json, headers=headers)
    return response
