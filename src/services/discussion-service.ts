/**
 * @fileOverview A service for fetching and managing discussion comments.
 */
'use server';

import { projects, currentUser, allDonations } from '@/lib/data';
import type { Comment } from '@/lib/data';

/**
 * Fetches all comments for a given project.
 * @param projectId The ID of the project.
 * @returns A promise that resolves to an array of comments.
 */
export async function getComments(projectId: string): Promise<Comment[]> {
  try {
    const project = projects.find(p => p.id === projectId);
    return project?.discussion.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  } catch (error) {
    console.error(`Error fetching comments for project ${projectId}:`, error);
    return [];
  }
}

/**
 * Adds a new comment to a project's discussion.
 * @param projectId The ID of the project.
 * @param commentData The data for the new comment.
 * @returns A promise that resolves to the newly created comment.
 */
export async function addComment(projectId: string, commentData: { text: string; replyTo?: string }): Promise<Comment | null> {
  try {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if the user has donated before
    const isDonor = allDonations.some(donation => donation.donor.id === currentUser.id);
    const shouldAutoApprove = currentUser.isAdmin || currentUser.isProMember || isDonor;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      authorId: currentUser.id,
      avatarUrl: currentUser.avatarUrl,
      profileUrl: currentUser.profileUrl,
      date: new Date().toISOString(),
      text: commentData.text,
      replyTo: commentData.replyTo,
      status: shouldAutoApprove ? 'approved' : 'pending',
    };

    project.discussion.unshift(newComment);
    
    console.log(`Comment added to project ${projectId}:`, newComment);
    return newComment;

  } catch (error) {
    console.error(`Error adding comment to project ${projectId}:`, error);
    return null;
  }
}

/**
 * Updates a specific comment.
 * @param projectId The ID of the project the comment belongs to.
 * @param commentId The ID of the comment to update.
 * @param updates The fields to update.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateComment(projectId: string, commentId: string, updates: Partial<Comment>): Promise<void> {
    try {
        const project = projects.find(p => p.id === projectId);
        if (!project) {
          throw new Error("Project not found");
        }

        const commentIndex = project.discussion.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
            throw new Error("Comment not found");
        }
        
        if (updates.status === 'deleted') {
            project.discussion.splice(commentIndex, 1);
            console.log(`Comment ${commentId} deleted from project ${projectId}`);
        } else {
            project.discussion[commentIndex] = { ...project.discussion[commentIndex], ...updates };
            console.log(`Comment ${commentId} in project ${projectId} updated:`, updates);
        }

    } catch (error) {
        console.error(`Error updating comment ${commentId}:`, error);
    }
}
