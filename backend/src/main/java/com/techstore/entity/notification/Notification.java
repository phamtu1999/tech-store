package com.techstore.entity.notification;

import com.techstore.entity.base.BaseEntity;
import com.techstore.entity.user.User;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column
    private String type;

    @Column
    private String link;

    @Column(nullable = false)
    @Builder.Default
    private boolean isRead = false;
}
