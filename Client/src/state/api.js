import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  tagTypes: ["User", "GameList", "FullList"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => {
        return `general/user/${id}`;
      },
      providesTags: ["User"],
    }),
    getGames: build.query({
      query: (page, pageSize, sort, search) => ({
        url: `/`,
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["GameList"],
    }),
    getFullGamesList: build.query({
      query: () => {return `/` } ,
      providesTags: ["FullList"],
    }),
  }),
});

export const { useGetUserQuery, useGetGamesQuery, useGetFullGamesListQuery } = api;
