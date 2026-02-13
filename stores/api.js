import { defineStore } from 'pinia'

// api imports
import { updateUsername, updateTag, uploadAvatar, getAvatar, deleteAvatar, updatePassword, isValidPassword, updateFakePassword, deletePublicKey, updatePublicKey, getStatus } from './api/meApi'
import { getUserPublicKey, getUsername, getUserIdByFullName, getUserTag, getUserCreationDate, getUserStatus } from './api/userApi'
import { getPrivateDiscussion, updateDiscussionStatus, getLastMessages, deleteAllDiscussions } from './api/messageApi'
import { getFile, postFile, getFileMetadata } from './api/fileApi'
import { getFriendStatus, sendFriendRequest, removeFriend, blockUser, unblockUser, cancelFriendRequest, acceptFriendRequest, refuseFriendRequest, getFriendsList, deleteFriends } from './api/friendApi';
import { sendResetPasswordMail, sendChangePasswordMail, sendChangeEmailMail } from './api/mailApi';
import { postVerificationChangeMail } from './api/verificationApi';
import { createServer, uploadServerBanner, uploadServerIcon, getUserServers, getServerIcon, getServerBanner } from './api/serverApi';

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

        async getUserStatus(userId) {
            return getUserStatus(this.urls, userId);
        },

        async getUserTag(userId) {
            return getUserTag(this.urls, userId);
        },

        async getUserCreationDate(userId) {
            return getUserCreationDate(this.urls, userId);
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

        async getStatus() {
            return getStatus(this.urls);
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

        async updateFakePassword(fakePassword, passwordConfirmation, currentPassword) {
            return updateFakePassword(this.urls, fakePassword, passwordConfirmation, currentPassword);
        },

        async deletePublicKey() {
            return deletePublicKey(this.urls);
        },

        async updatePublicKey(newPublicKey) {
            return updatePublicKey(this.urls, newPublicKey);
        },

        /**
         * Api functions for the root /message
         */

        async getPrivateDiscussion(to, page = 1) {
            return getPrivateDiscussion(this.urls, to, page);
        },

        async updateDiscussionStatus(to, status) {
            return updateDiscussionStatus(this.urls, to, status);
        },

        async getLastMessages() {
            return getLastMessages(this.urls);
        },

        async deleteAllDiscussions() {
            return deleteAllDiscussions(this.urls);
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

        async getFriendsList(status) {
            return getFriendsList(this.urls, status);
        },

        async deleteFriends() {
            return deleteFriends(this.urls);
        },

        /**
         * End of Api functions for the root /mail
         */

        async sendResetPasswordMail(email) {
            return sendResetPasswordMail(this.urls, email);
        },

        async sendChangePasswordMail(id, token, currentPassword, passwordConfirmation) {
            return sendChangePasswordMail(this.urls, id, token, currentPassword, passwordConfirmation);
        },

        async sendChangeEmailMail(id, newEmail, password) {
            return sendChangeEmailMail(this.urls, id, newEmail, password);
        },

        /**
         * End of Api functions for the root /verification
         */

        async postVerificationChangeMail(id ,token) {
            return postVerificationChangeMail(this.urls, id, token);
        },

        /**
         * End of Api functions for the root /server
         */

        async createServer(name, owner) {
            return createServer(this.urls, name, owner);
        },

        async uploadServerBanner(code, file) {
            return uploadServerBanner(this.urls, code, file);
        },

        async uploadServerIcon(code, file) {
            return uploadServerIcon(this.urls, code, file);
        },

        async getUserServers(userId) {
            return getUserServers(this.urls, userId);
        },

        async getServerIcon(code) {
            return getServerIcon(this.urls, code);
        },

        async getServerBanner(code) {
            return getServerBanner(this.urls, code);
        },

    }
})