'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
};

/**
 * Reusable Feedback Detail Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onOpenChange - Callback when modal open state changes
 * @param {Object|null} props.feedback - Feedback object to display (null to hide)
 * @param {Function} props.onFeedbackUpdate - Optional callback when feedback is updated (like, dislike, visibility)
 * @param {boolean} props.showComments - Whether to show comments section (default: true)
 */
export function FeedbackDetailModal({
  open,
  onOpenChange,
  feedback,
  onFeedbackUpdate,
  showComments = true,
}) {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch full feedback details when modal opens
  useEffect(() => {
    if (open && feedback?.id) {
      fetchFeedbackDetails(feedback.id);
    } else {
      setSelectedFeedback(null);
      setCommentText('');
    }
  }, [open, feedback?.id]);

  const fetchFeedbackDetails = async (feedbackId) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/feedback/${feedbackId}`);
      setSelectedFeedback(res.data);
    } catch (error) {
      console.error('Failed to fetch feedback details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (feedbackItem) => {
    try {
      await api.patch(`/admin/feedback/${feedbackItem.id}`, { action: 'toggle_visibility' });
      setSelectedFeedback({ ...selectedFeedback, is_visible: !selectedFeedback.is_visible });
      if (onFeedbackUpdate) {
        onFeedbackUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const handleLike = async (feedbackItem) => {
    try {
      await api.patch(`/admin/feedback/${feedbackItem.id}`, { action: 'like' });
      setSelectedFeedback({
        ...selectedFeedback,
        likes: (selectedFeedback.likes || 0) + 1,
      });
      if (onFeedbackUpdate) {
        onFeedbackUpdate();
      }
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleDislike = async (feedbackItem) => {
    try {
      await api.patch(`/admin/feedback/${feedbackItem.id}`, { action: 'dislike' });
      setSelectedFeedback({
        ...selectedFeedback,
        dislikes: (selectedFeedback.dislikes || 0) + 1,
      });
      if (onFeedbackUpdate) {
        onFeedbackUpdate();
      }
    } catch (error) {
      console.error('Failed to dislike:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selectedFeedback) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/admin/feedback/${selectedFeedback.id}/comments`, {
        body: commentText,
      });
      setSelectedFeedback({
        ...selectedFeedback,
        comments: [...(selectedFeedback.comments || []), res.data],
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (!selectedFeedback && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription>View and manage feedback details</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : selectedFeedback ? (
          <div className="space-y-6">
            {/* Feedback Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={STATUS_COLORS[selectedFeedback.status] || ''}>
                  {selectedFeedback.status?.replace('_', ' ').toUpperCase()}
                </Badge>
                {selectedFeedback.category && (
                  <Badge variant="outline">{selectedFeedback.category}</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleVisibility(selectedFeedback)}
                >
                  {selectedFeedback.is_visible ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-secondary-foreground whitespace-pre-line">
                  {selectedFeedback.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {selectedFeedback.name && (
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedFeedback.name}</span>
                  </div>
                )}
                {selectedFeedback.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{selectedFeedback.phone}</span>
                  </div>
                )}
                {selectedFeedback.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedFeedback.email}</span>
                  </div>
                )}
                {selectedFeedback.candidate && (
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Candidate:</span>
                    <span className="font-medium">{selectedFeedback.candidate.name}</span>
                  </div>
                )}
                {selectedFeedback.candidate?.constituency && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Constituency:</span>
                    <span className="font-medium">
                      {selectedFeedback.candidate.constituency.name}
                    </span>
                  </div>
                )}
                {selectedFeedback.candidate?.party && (
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Party:</span>
                    <span className="font-medium">{selectedFeedback.candidate.party.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(selectedFeedback.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLike(selectedFeedback)}
                >
                  <ThumbsUp className="size-4 me-2" />
                  Like ({selectedFeedback.likes || 0})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDislike(selectedFeedback)}
                >
                  <ThumbsDown className="size-4 me-2" />
                  Dislike ({selectedFeedback.dislikes || 0})
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="size-4" />
                  <span>{selectedFeedback.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  <h3 className="font-semibold">Comments</h3>
                  <Badge variant="outline">{selectedFeedback.comments?.length || 0}</Badge>
                </div>

                {/* Comments Table */}
                {selectedFeedback.comments && selectedFeedback.comments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFeedback.comments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell>
                            {comment.user ? (
                              <div className="flex items-center gap-2">
                                <User className="size-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {comment.user.name || comment.user.email || 'Unknown'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Anonymous</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{comment.body}</p>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                )}

                {/* Add Comment */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || submittingComment}
                    size="sm"
                  >
                    {submittingComment ? 'Submitting...' : 'Add Comment'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

