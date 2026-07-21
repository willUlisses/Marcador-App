package br.com.will.marcador_api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_password_reset_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public PasswordResetToken(String token, User user, int expirationInMinutes) {
        this.token = token;
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusMinutes(expirationInMinutes);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

}
