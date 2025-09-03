import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserAuthData } from 'entities/User';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { getArticleDetailsData } from 'entities/Article/model/selectors/articleDetails';
import { Comment } from 'entities/Comment';
import { fetchCommentsByArticleId } from 'pages/ArticleDetailsPage/model/services/fetchCommentsByArticleId/fetchCommentsByArticleId';


export const addCommentForArticle = createAsyncThunk<Comment, string, ThunkConfig<string>>(
    'articleDetails/addCommentForArticle',
    async (text, thunkAPI) => {
        const { dispatch, extra, rejectWithValue, getState } = thunkAPI;

        const userData = getUserAuthData(getState());
        const artical = getArticleDetailsData(getState());

        if (!userData || !text || !artical) {
            return rejectWithValue('no data');
        }

        const comment = {
            articleId: artical.id,
            userId: userData.id,
            text
        }

        try {
            const response = await extra.api.post<Comment>('/comments', comment);

            if (!response.data) {
                throw new Error();
            }

            // dispatch(addCommentFormActions.setText(''));
            dispatch(fetchCommentsByArticleId(artical.id));

            return response.data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
