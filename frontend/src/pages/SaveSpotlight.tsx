import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Grid,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon,
  Comment as CommentIcon,
  Chat as ChatIcon,
  Add as AddIcon,
  Send as SendIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as MotivationIcon,
  EmojiEvents as AchievementIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { saveSpotlightAPI } from '../services/saveSpotlightService';
import { goalsAPI } from '../services/apiService';
import { SharedGoal, FinancialGoal, ChatRoom, ChatMessage, GoalComment } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`spotlight-tabpanel-${index}`}
      aria-labelledby={`spotlight-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SaveSpotlight: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [sharedGoals, setSharedGoals] = useState<SharedGoal[]>([]);
  const [myGoals, setMyGoals] = useState<FinancialGoal[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Dialog states
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Comments dialog
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SharedGoal | null>(null);
  const [goalComments, setGoalComments] = useState<GoalComment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sharedGoalsRes, myGoalsRes, chatRoomsRes] = await Promise.all([
        saveSpotlightAPI.getSharedGoals(),
        goalsAPI.getAll(),
        saveSpotlightAPI.getChatRooms(),
      ]);

      if (sharedGoalsRes.success) {
        setSharedGoals(sharedGoalsRes.data);
      }
      if (myGoalsRes.success) {
        setMyGoals(myGoalsRes.data);
      }
      if (chatRoomsRes.success) {
        setChatRooms(chatRoomsRes.data);
      }
    } catch (err) {
      setError('Failed to load Save Spotlight data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleLikeGoal = async (goalId: number) => {
    try {
      const goal = sharedGoals.find(g => g.id === goalId);
      if (!goal) return;

      if (goal.isLiked) {
        await saveSpotlightAPI.unlikeGoal(goalId);
      } else {
        await saveSpotlightAPI.likeGoal(goalId);
      }

      // Update local state
      setSharedGoals(prev => prev.map(g => 
        g.id === goalId 
          ? { 
              ...g, 
              isLiked: !g.isLiked, 
              likesCount: g.isLiked ? g.likesCount - 1 : g.likesCount + 1 
            }
          : g
      ));
    } catch (err) {
      setError('Failed to update like status');
    }
  };

  const handleShareGoal = async (goalId: number) => {
    try {
      // Find the goal to share
      const goalToShare = myGoals.find(g => g.id === goalId);
      if (!goalToShare) {
        setError('Goal not found');
        return;
      }

      // Prepare goal data for sharing
      const shareData = {
        title: goalToShare.title,
        description: goalToShare.description,
        targetAmount: goalToShare.targetAmount,
        currentAmount: goalToShare.currentAmount,
        deadline: goalToShare.targetDate,
        category: goalToShare.category,
      };

      await saveSpotlightAPI.shareGoal(shareData);
      setSuccessMessage('Goal shared successfully!');
      setShareDialogOpen(false);
      loadData(); // Reload to see the shared goal
    } catch (err) {
      setError('Failed to share goal');
    }
  };

  const handleOpenComments = async (goal: SharedGoal) => {
    setSelectedGoal(goal);
    try {
      const response = await saveSpotlightAPI.getGoalComments(goal.id);
      if (response.success) {
        setGoalComments(response.data);
      }
    } catch (err) {
      setError('Failed to load comments');
    }
    setCommentsDialogOpen(true);
  };

  const handleAddComment = async () => {
    if (!selectedGoal || !newComment.trim()) return;

    try {
      const response = await saveSpotlightAPI.addGoalComment(selectedGoal.id, newComment.trim());
      if (response.success) {
        setGoalComments(prev => [...prev, response.data]);
        setNewComment('');
        // Update comments count
        setSharedGoals(prev => prev.map(g => 
          g.id === selectedGoal.id 
            ? { ...g, commentsCount: g.commentsCount + 1 }
            : g
        ));
      }
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleJoinChatRoom = async (roomId: number) => {
    try {
      // For demo purposes, simulate joining chat room without API call
      const room = chatRooms.find(r => r.id === roomId);
      if (room) {
        setSelectedChatRoom(room);
        // Load messages for the selected room
        const messagesResponse = await saveSpotlightAPI.getChatMessages(roomId);
        if (messagesResponse.success) {
          setChatMessages(messagesResponse.data);
        }
        setChatDialogOpen(true);
        setSuccessMessage(`Joined ${room.name} successfully!`);
      }
    } catch (err) {
      setError('Failed to join chat room');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChatRoom || !newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await saveSpotlightAPI.sendChatMessage(selectedChatRoom.id, newMessage.trim());
      if (response.success) {
        setChatMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'warning';
    return 'primary';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Emergency Fund': '#f44336',
      'Home Purchase': '#4caf50',
      'Car Purchase': '#2196f3',
      'Vacation/Travel': '#ff9800',
      'Education': '#9c27b0',
      'Wedding': '#e91e63',
      'Retirement': '#607d8b',
      'Investment': '#795548',
      'Other': '#9e9e9e',
    };
    return colors[category] || '#9e9e9e';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Save Spotlight
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Share your financial journey and connect with others
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="save spotlight tabs">
            <Tab 
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ShareIcon />
                  <span>Shared Goals</span>
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChatIcon />
                  <span>Community Chat</span>
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MotivationIcon />
                  <span>My Shared Goals</span>
                </Stack>
              } 
            />
          </Tabs>
        </Box>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        {/* Shared Goals Feed */}
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Community Goals ({sharedGoals.length})
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadData}
              variant="outlined"
              size="small"
            >
              Refresh
            </Button>
          </Box>

          {sharedGoals.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <ShareIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No shared goals yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first to share a financial goal with the community!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            sharedGoals.map((goal) => (
              <Card key={goal.id} sx={{ position: 'relative' }}>
                <CardContent>
                  {/* User Info */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getUserInitials(goal.user.firstName, goal.user.lastName)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {goal.user.firstName} {goal.user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{goal.user.username} • {formatDate(goal.createdAt)}
                      </Typography>
                    </Box>
                    <Chip 
                      label={goal.category}
                      size="small"
                      sx={{ 
                        bgcolor: getCategoryColor(goal.category),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Stack>

                  {/* Goal Content */}
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {goal.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {goal.description}
                  </Typography>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {goal.progress.toFixed(1)}% complete
                      </Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={goal.progress} 
                      color={getProgressColor(goal.progress)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Target Date: {formatDate(goal.targetDate)}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      startIcon={goal.isLiked ? <FavoriteIcon /> : <FavoriteOutlineIcon />}
                      onClick={() => handleLikeGoal(goal.id)}
                      color={goal.isLiked ? "error" : "inherit"}
                      size="small"
                    >
                      {goal.likesCount}
                    </Button>
                    <Button
                      startIcon={<CommentIcon />}
                      onClick={() => handleOpenComments(goal)}
                      size="small"
                    >
                      {goal.commentsCount}
                    </Button>
                    <Box flex={1} />
                    <Chip 
                      icon={<AchievementIcon />} 
                      label={`${Math.ceil((goal.targetAmount - goal.currentAmount) / ((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)))} per month to goal`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* Community Chat */}
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Chat Rooms
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
            >
              Create Room
            </Button>
          </Box>

          {chatRooms.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No chat rooms available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chat rooms will appear here when they become available.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {chatRooms.map((room) => (
                <Grid item xs={12} md={6} lg={4} key={room.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <GroupIcon color="primary" />
                          <Typography variant="h6" fontWeight="bold">
                            {room.name}
                          </Typography>
                          {room.isPublic ? <PublicIcon fontSize="small" /> : <PrivateIcon fontSize="small" />}
                        </Stack>
                        
                        <Typography variant="body2" color="text.secondary">
                          {room.description}
                        </Typography>
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip 
                            label={`${room.memberCount} members`}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Active {formatTime(room.lastActivity)}
                          </Typography>
                        </Stack>
                        
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleJoinChatRoom(room.id)}
                          fullWidth
                          startIcon={<ChatIcon />}
                        >
                          Join Chat
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* My Shared Goals */}
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Share Your Goals
            </Typography>
            <Button
              startIcon={<ShareIcon />}
              variant="contained"
              onClick={() => setShareDialogOpen(true)}
              disabled={myGoals.length === 0}
            >
              Share a Goal
            </Button>
          </Box>

          {myGoals.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Goals to Share
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create some financial goals first, then come back to share them with the community.
              </Typography>
            </Paper>
          ) : (
            <Alert severity="info">
              You have {myGoals.length} goal(s) that can be shared with the community. 
              Sharing your goals can help you stay motivated and inspire others!
            </Alert>
          )}
        </Stack>
      </TabPanel>

      {/* Share Goal Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share a Goal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose a goal to share with the Save Spotlight community. Sharing helps you stay accountable and inspires others!
          </Typography>
          <Stack spacing={2}>
            {myGoals.map((goal) => (
              <Card key={goal.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {goal.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {goal.description}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleShareGoal(goal.id)}
                    >
                      Share This Goal
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={commentsDialogOpen} onClose={() => setCommentsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Comments - {selectedGoal?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {goalComments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                No comments yet. Be the first to encourage {selectedGoal?.user.firstName}!
              </Typography>
            ) : (
              goalComments.map((comment) => (
                <Stack key={comment.id} direction="row" spacing={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {getUserInitials(comment.user.firstName, comment.user.lastName)}
                  </Avatar>
                  <Box flex={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.user.firstName} {comment.user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(comment.timestamp)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2">
                      {comment.comment}
                    </Typography>
                  </Box>
                </Stack>
              ))
            )}
            
            <Divider />
            
            {/* Add Comment */}
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Add an encouraging comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{ minWidth: 100 }}
              >
                Comment
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onClose={() => setChatDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <GroupIcon />
            <Box>
              <Typography variant="h6">
                {selectedChatRoom?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedChatRoom?.memberCount} members
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ height: 400 }}>
            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              {chatMessages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No messages yet. Start the conversation!
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {chatMessages.map((message) => (
                    <Stack key={message.id} direction="row" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getUserInitials(message.user.firstName, message.user.lastName)}
                      </Avatar>
                      <Box flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {message.user.firstName} {message.user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Stack>
                        <Typography variant="body2">
                          {message.message}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
            
            {/* Message Input */}
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                variant="outlined"
                size="small"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                startIcon={sendingMessage ? <CircularProgress size={16} /> : <SendIcon />}
                sx={{ minWidth: 100 }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SaveSpotlight;
