import { defineStore } from 'pinia'

// api imports
import { updateUsername, updateTag, uploadAvatar, getAvatar, deleteAvatar, updatePassword, isValidPassword } from './api/meApi'
import { getUserPublicKey, getUsername, getUserIdByFullName } from './api/userApi'
import { getPrivateDiscussion, updateDiscussionStatus, getLastMessages } from './api/messageApi'
import { getFile, postFile, getFileMetadata } from './api/fileApi'
import { getFriendStatus, sendFriendRequest, removeFriend, blockUser, unblockUser, cancelFriendRequest, acceptFriendRequest, refuseFriendRequest, getFriendsList } from './api/friendApi';

export const useApiStore = defineStore('api', {
    state: () => ({
        urls: {
            backend: 'http://localhost:30001',
            ws: 'http://localhost:30001',
        }
    }),

    actions: {


        /**
         * Api functions for the root /user
         */

        async getUserPublicKey(userId) {
            return getUserPublicKey(this.urls, userId);
        },

        async getUsername(userId) {
            return getUsername(this.urls, userId);
        },

        async getUserIdByFullName(username, code) {
            return getUserIdByFullName(this.urls, username, code);
        },

        
        /**
         * Api functions for the root /me
         */

        async updateUsername(newUsername) {
            return updateUsername(this.urls, newUsername);
        },

        async updateTag(newTag) {
            return updateTag(this.urls, newTag);
        },

        async getAvatar(userId) {
            return getAvatar(this.urls, userId);
        },

        async uploadAvatar(file) {
            return uploadAvatar(this.urls, file);
        },

        async deleteAvatar() {
            return deleteAvatar(this.urls);
        },

        async updatePassword(newPassword, passwordConfirmation, currentPassword) {
            return updatePassword(this.urls, newPassword, passwordConfirmation, currentPassword);
        },

        async isValidPassword(password) {
            return isValidPassword(this.urls, password);
        },


        /**
         * Api functions for the root /message
         */

        async getPrivateDiscussion(to) {
            return getPrivateDiscussion(this.urls, to);
        },

        async updateDiscussionStatus(to, status) {
            return updateDiscussionStatus(this.urls, to, status);
        },

        async getLastMessages() {
            return getLastMessages(this.urls);
        },


        /**
         * Api functions for the root /file
         */

        async getFile(fileId) {
            return getFile(this.urls, fileId);
        },

        async postFile(fileData) {
            return postFile(this.urls, fileData);
        },

        async getFileMetadata(fileId) {
            return getFileMetadata(this.urls, fileId);
        },


        /**
         * Api functions for the root /friend
         */

        async getFriendStatus(userId) {
            return getFriendStatus(this.urls, userId);
        },

        async sendFriendRequest(userId) {
            return sendFriendRequest(this.urls, userId);
        },

        async removeFriend(userId) {
            return removeFriend(this.urls, userId);
        },

        async acceptFriendRequest(userId) {
            return acceptFriendRequest(this.urls, userId);
        },

        async refuseFriendRequest(userId) {
            return refuseFriendRequest(this.urls, userId);
        },

        async blockUser(userId) {
            return blockUser(this.urls, userId);
        },

        async unblockUser(userId) {
            return unblockUser(this.urls, userId);
        },

        async cancelFriendRequest(userId) {
            return cancelFriendRequest(this.urls, userId);
        },

        async getFriendsList() {
            return getFriendsList(this.urls);
        }

    }
})