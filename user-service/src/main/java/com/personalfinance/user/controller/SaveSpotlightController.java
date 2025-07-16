package com.personalfinance.user.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.personalfinance.user.dto.AddCommentRequest;
import com.personalfinance.user.dto.ChatMessageDTO;
import com.personalfinance.user.dto.ChatRoomDTO;
import com.personalfinance.user.dto.CreateChatRoomRequest;
import com.personalfinance.user.dto.GoalCommentDTO;
import com.personalfinance.user.dto.SendMessageRequest;
import com.personalfinance.user.dto.ShareGoalRequest;
import com.personalfinance.user.dto.SharedGoalDTO;
import com.personalfinance.user.model.ChatMessage;
import com.personalfinance.user.model.ChatRoom;
import com.personalfinance.user.model.GoalComment;
import com.personalfinance.user.model.GoalLike;
import com.personalfinance.user.model.SharedGoal;
import com.personalfinance.user.model.User;
import com.personalfinance.user.repository.ChatMessageRepository;
import com.personalfinance.user.repository.ChatRoomRepository;
import com.personalfinance.user.repository.GoalCommentRepository;
import com.personalfinance.user.repository.GoalLikeRepository;
import com.personalfinance.user.repository.SharedGoalRepository;
import com.personalfinance.user.repository.UserRepository;
import com.personalfinance.user.security.JwtUtils;

@RestController
@RequestMapping("/users/save-spotlight")  // Updated for API Gateway routing
public class SaveSpotlightController {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private SharedGoalRepository sharedGoalRepository;

    @Autowired
    private GoalCommentRepository goalCommentRepository;

    @Autowired
    private GoalLikeRepository goalLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // CORS Preflight Handlers - Disabled: CORS handled by API Gateway
    // @RequestMapping(method = RequestMethod.OPTIONS, value = "/**")
    // public ResponseEntity<?> handlePreflight(HttpServletResponse response) {
    //     response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    //     response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //     response.setHeader("Access-Control-Allow-Credentials", "true");
    //     response.setHeader("Access-Control-Max-Age", "3600");
    //     return ResponseEntity.ok().build();
    // }

    // Chat Rooms Endpoints
    @GetMapping("/chat/rooms")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getChatRooms() {
        try {
            List<ChatRoom> rooms = chatRoomRepository.findByIsPublicTrueOrderByLastActivityDesc();
            List<ChatRoomDTO> roomDTOs = rooms.stream()
                .map(this::convertToChatRoomDTO)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", roomDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch chat rooms: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/chat/rooms")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createChatRoom(@RequestBody CreateChatRoomRequest request, 
                                          @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            ChatRoom room = new ChatRoom(request.getName(), request.getDescription(), userId);
            room.setIsPublic(request.getIsPublic());
            room = chatRoomRepository.save(room);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", convertToChatRoomDTO(room));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create chat room: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/chat/rooms/{roomId}/join")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> joinChatRoom(@PathVariable Long roomId, 
                                        @RequestHeader("Authorization") String token) {
        try {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
            if (!roomOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Chat room not found");
                return ResponseEntity.notFound().build();
            }
            
            ChatRoom room = roomOpt.get();
            room.setMemberCount(room.getMemberCount() + 1);
            room.setLastActivity(LocalDateTime.now());
            chatRoomRepository.save(room);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully joined chat room");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to join chat room: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/chat/rooms/{roomId}/messages")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getChatMessages(@PathVariable Long roomId,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "50") int size) {
        try {
            List<ChatMessage> messages = chatMessageRepository.findByRoomIdWithUserOrderByTimestampAsc(roomId);
            List<ChatMessageDTO> messageDTOs = messages.stream()
                .map(this::convertToChatMessageDTO)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", messageDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch messages: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/chat/rooms/{roomId}/messages")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendMessage(@PathVariable Long roomId,
                                       @RequestBody SendMessageRequest request,
                                       @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            ChatMessage message = new ChatMessage(roomId, userId, request.getMessage());
            if (request.getReplyToId() != null) {
                message.setReplyToId(request.getReplyToId());
            }
            
            message = chatMessageRepository.save(message);
            
            // Update room last activity
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
            if (roomOpt.isPresent()) {
                ChatRoom room = roomOpt.get();
                room.setLastActivity(LocalDateTime.now());
                chatRoomRepository.save(room);
            }
            
            // Fetch message with user info
            message = chatMessageRepository.findById(message.getId()).orElse(message);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", convertToChatMessageDTO(message));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send message: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Shared Goals Endpoints
    @GetMapping("/goals")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getSharedGoals(@RequestHeader("Authorization") String token) {
        try {
            Long currentUserId = getUserIdFromToken(token);
            List<SharedGoal> goals = sharedGoalRepository.findPublicGoalsWithUser();
            
            List<SharedGoalDTO> goalDTOs = goals.stream()
                .map(goal -> convertToSharedGoalDTO(goal, currentUserId))
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", goalDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch shared goals: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/goals/share")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> shareGoal(@RequestBody ShareGoalRequest request,
                                     @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            // For demo purposes, create a shared goal directly
            // In production, you'd fetch the goal from the goals service
            SharedGoal sharedGoal = new SharedGoal();
            sharedGoal.setUserId(userId);
            sharedGoal.setGoalId(request.getGoalId());
            sharedGoal.setTitle("Demo Shared Goal");
            sharedGoal.setDescription("This is a demo shared goal from the API");
            sharedGoal.setTargetAmount(10000.0);
            sharedGoal.setCurrentAmount(3000.0);
            sharedGoal.setCategory("Other");
            sharedGoal.setTargetDate(LocalDateTime.now().plusMonths(6));
            
            sharedGoal = sharedGoalRepository.save(sharedGoal);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", convertToSharedGoalDTO(sharedGoal, userId));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to share goal: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/goals/{goalId}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> likeGoal(@PathVariable Long goalId,
                                    @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            Optional<GoalLike> existingLike = goalLikeRepository.findByGoalIdAndUserId(goalId, userId);
            if (existingLike.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Goal already liked");
                return ResponseEntity.badRequest().body(response);
            }
            
            GoalLike like = new GoalLike(goalId, userId);
            goalLikeRepository.save(like);
            
            // Update likes count
            Optional<SharedGoal> goalOpt = sharedGoalRepository.findById(goalId);
            if (goalOpt.isPresent()) {
                SharedGoal goal = goalOpt.get();
                goal.setLikesCount(goal.getLikesCount() + 1);
                sharedGoalRepository.save(goal);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Goal liked successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to like goal: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/goals/{goalId}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> unlikeGoal(@PathVariable Long goalId,
                                      @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            goalLikeRepository.deleteByGoalIdAndUserId(goalId, userId);
            
            // Update likes count
            Optional<SharedGoal> goalOpt = sharedGoalRepository.findById(goalId);
            if (goalOpt.isPresent()) {
                SharedGoal goal = goalOpt.get();
                goal.setLikesCount(Math.max(0, goal.getLikesCount() - 1));
                sharedGoalRepository.save(goal);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Goal unliked successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to unlike goal: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/goals/{goalId}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getGoalComments(@PathVariable Long goalId) {
        try {
            List<GoalComment> comments = goalCommentRepository.findByGoalIdWithUserOrderByTimestampAsc(goalId);
            List<GoalCommentDTO> commentDTOs = comments.stream()
                .map(this::convertToGoalCommentDTO)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", commentDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch comments: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/goals/{goalId}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addGoalComment(@PathVariable Long goalId,
                                          @RequestBody AddCommentRequest request,
                                          @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            GoalComment comment = new GoalComment(goalId, userId, request.getComment());
            comment = goalCommentRepository.save(comment);
            
            // Update comments count
            Optional<SharedGoal> goalOpt = sharedGoalRepository.findById(goalId);
            if (goalOpt.isPresent()) {
                SharedGoal goal = goalOpt.get();
                goal.setCommentsCount(goal.getCommentsCount() + 1);
                sharedGoalRepository.save(goal);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", convertToGoalCommentDTO(comment));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add comment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Utility Methods
    private Long getUserIdFromToken(String token) {
        String jwt = token.replace("Bearer ", "");
        String username = jwtUtils.getUserNameFromJwtToken(jwt);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    private ChatRoomDTO convertToChatRoomDTO(ChatRoom room) {
        return new ChatRoomDTO(
            room.getId(),
            room.getName(),
            room.getDescription(),
            room.getIsPublic(),
            room.getMemberCount(),
            room.getCreatedBy(),
            room.getCreatedAt(),
            room.getLastActivity()
        );
    }

    private ChatMessageDTO convertToChatMessageDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO(
            message.getId(),
            message.getRoomId(),
            message.getUserId(),
            message.getMessage(),
            message.getTimestamp(),
            message.getIsEdited(),
            message.getReplyToId()
        );
        
        if (message.getUser() != null) {
            dto.setUser(new ChatMessageDTO.UserInfo(
                message.getUser().getId(),
                message.getUser().getUsername(),
                message.getUser().getFirstName(),
                message.getUser().getLastName(),
                message.getUser().getAvatarUrl()
            ));
        }
        
        return dto;
    }

    private SharedGoalDTO convertToSharedGoalDTO(SharedGoal goal, Long currentUserId) {
        SharedGoalDTO dto = new SharedGoalDTO();
        dto.setId(goal.getId());
        dto.setUserId(goal.getUserId());
        dto.setGoalId(goal.getGoalId());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAmount(goal.getCurrentAmount());
        dto.setCategory(goal.getCategory());
        dto.setTargetDate(goal.getTargetDate());
        dto.setIsPublic(goal.getIsPublic());
        dto.setLikesCount(goal.getLikesCount());
        dto.setCommentsCount(goal.getCommentsCount());
        dto.setCreatedAt(goal.getCreatedAt());
        dto.setUpdatedAt(goal.getUpdatedAt());
        dto.setProgress(goal.getProgress());
        
        // Check if current user has liked this goal
        Boolean isLiked = goalLikeRepository.existsByGoalIdAndUserId(goal.getId(), currentUserId);
        dto.setIsLiked(isLiked);
        
        if (goal.getUser() != null) {
            dto.setUser(new SharedGoalDTO.UserInfo(
                goal.getUser().getId(),
                goal.getUser().getUsername(),
                goal.getUser().getFirstName(),
                goal.getUser().getLastName(),
                goal.getUser().getAvatarUrl()
            ));
        }
        
        return dto;
    }

    private GoalCommentDTO convertToGoalCommentDTO(GoalComment comment) {
        GoalCommentDTO dto = new GoalCommentDTO(
            comment.getId(),
            comment.getGoalId(),
            comment.getUserId(),
            comment.getComment(),
            comment.getTimestamp(),
            comment.getIsEdited()
        );
        
        if (comment.getUser() != null) {
            dto.setUser(new GoalCommentDTO.UserInfo(
                comment.getUser().getId(),
                comment.getUser().getUsername(),
                comment.getUser().getFirstName(),
                comment.getUser().getLastName(),
                comment.getUser().getAvatarUrl()
            ));
        }
        
        return dto;
    }
}
