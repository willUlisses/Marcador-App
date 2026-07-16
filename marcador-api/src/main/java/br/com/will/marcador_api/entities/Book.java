package br.com.will.marcador_api.entities;

import br.com.will.marcador_api.entities.enums.Genre;
import br.com.will.marcador_api.entities.enums.ReadingStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tb_books")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private Integer rating;

    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = Genre.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "tb_book_genres", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "genre")
    private Set<Genre> genres = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private ReadingStatus status = ReadingStatus.WANT_TO_READ;

    @Column(nullable = false)
    private Integer currentPage;

    @Column(nullable = false)
    private Integer totalPages;

    private String opinion;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reflection> reflections =  new ArrayList<>();

    public void setRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("A nota do livro deve estar entre 1 e 5");
        }
        this.rating = rating;
    }

    public void addReflection(Reflection reflection) {
        reflections.add(reflection);
        reflection.setBook(this);
    }

    public void removeReflection(Reflection reflection) {
        reflections.remove(reflection);
        reflection.setBook(null);
    }
}
