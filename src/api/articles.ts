import {
  ArticleResponse,
  FeedQueryStrings,
  FeedResponse,
  FeedsResponse,
  PostArticlePayload,
  PutArticlePayload,
} from '@/types/api/articles';

import { COMMON_HEADERS, FEED_PER_PAGE, HTTP_METHOD } from '@/constants/api';
import { API_BASE_URL } from '@/constants/env';
import { ERROR } from '@/constants/error';
import { COOKIE_ACCESS_TOKEN_KEY } from '@/constants/key';

import { getCookie } from '@/utils/cookie';

/* Client Side APIs */

// Create an article (Auth Required)
export const postArticle = (
  payload: PostArticlePayload,
  headers: HeadersInit = {},
  options: RequestInit = {},
): Promise<ArticleResponse> => {
  const accessToken = getCookie(COOKIE_ACCESS_TOKEN_KEY);

  return fetch(`${API_BASE_URL}/articles`, {
    ...options,
    method: HTTP_METHOD.POST,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

// Update an article (Auth Required)
export const putArticle = (
  slug: string,
  payload: PutArticlePayload,
  headers: HeadersInit = {},
  options: RequestInit = {},
): Promise<ArticleResponse> => {
  const accessToken = getCookie(COOKIE_ACCESS_TOKEN_KEY);

  return fetch(`${API_BASE_URL}/articles/${slug}`, {
    ...options,
    method: HTTP_METHOD.PUT,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

// Delete an article (Auth Required)
export const deleteArticle = (
  slug: string,
  headers: HeadersInit = {},
  options: RequestInit = {},
) => {
  const accessToken = getCookie(COOKIE_ACCESS_TOKEN_KEY);

  return fetch(`${API_BASE_URL}/articles/${slug}`, {
    ...options,
    method: HTTP_METHOD.DELETE,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

// -----------------------------------------------------------------------------------------------------

/* Server Side APIs for Next 13 APP Router extended fetch api */

// Get recent articles from users you follow (Auth Required)
export const getMyFeeds = (
  queryStrings: FeedQueryStrings = {
    limit: FEED_PER_PAGE,
  },
  headers: HeadersInit = {},
  options: RequestInit = {},
): Promise<FeedsResponse> => {
  const qs = new URLSearchParams(queryStrings).toString();

  return fetch(`${API_BASE_URL}/articles/feed?${qs}`, {
    ...options,
    method: HTTP_METHOD.GET,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

// Get recent articles globally (Auth Optional)
export const getGlobalFeeds = (
  queryStrings: FeedQueryStrings = {
    limit: FEED_PER_PAGE,
  },
  headers: HeadersInit = {},
  options: RequestInit = {},
): Promise<FeedsResponse> => {
  const qs = new URLSearchParams(queryStrings).toString();

  return fetch(`${API_BASE_URL}/articles?${qs}`, {
    ...options,
    method: HTTP_METHOD.GET,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

// Get an article (Auth Optional)
export const getArticle = (
  slug: string,
  headers: HeadersInit = {},
  options: RequestInit = {},
): Promise<FeedResponse | void> => {
  return fetch(`${API_BASE_URL}/articles/${slug}`, {
    ...options,
    method: HTTP_METHOD.GET,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
    },
  })
    .then((res) => res.json())
    .then((res: FeedResponse) => {
      if (res?.errors || res?.status === 'error') {
        throw new Error(ERROR.ARTICLE_DETAIL);
      }
      return res;
    })
    .catch((err) => console.error(err));
};
