import { api } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPropertyCategoryThunk = createAsyncThunk(
  'property-category/get',
  async (props: {token: string}) => {
    try {
      const res = await api.get("property-category/", {
        headers: {
          Authorization: `Bearer ${props.token}`
        }
      });

      return { success: 'Success Get Account!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const postPropertyCategoryThunk = createAsyncThunk(
  'property-category/post',
  async (props: {token: string, payload: { name: string }}) => {
    try {
      const res = await api.post("property-category/", { name: props.payload.name }, {
        headers: {
          Authorization: `Bearer ${props.token}`
        }
      });

      return { success: 'Success create property category!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const patchPropertyCategoryThunk = createAsyncThunk(
  'property-category/patch',
  async (props: {token: string, payload: { id?: string, name: string }}) => {
    try {
      const res = await api.patch(`property-category/${props.payload.id}`, { name: props.payload.name }, {
        headers: {
          Authorization: `Bearer ${props.token}`
        }
      });

      return { success: 'Success update name property category!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const deletePropertyCategoryThunk = createAsyncThunk(
  'property-category/delete',
  async (props: {token: string, payload: { id: string }}) => {
    try {
      const res = await api.delete(`property-category/${props.payload.id}`, {
        headers: {
          Authorization: `Bearer ${props.token}`
        }
      });

      return { success: 'Success delete name property category!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)
