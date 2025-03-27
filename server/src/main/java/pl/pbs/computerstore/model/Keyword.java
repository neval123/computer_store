package pl.pbs.computerstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Keyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "keyword_id", nullable = false)
    private long keywordId;
    @Column(name = "name", length = 50,nullable = false)
    private String name;

    @ManyToMany(mappedBy = "keywords")
    @JsonIgnore
    private List<Category> categories;

    @ManyToMany(mappedBy = "keywords")
    @JsonIgnore
    private List<Product> products;
    //gettery, settery i konstruktory

    public long getKeywordId() {
        return keywordId;
    }

    public void setKeywordId(long keywordId) {
        this.keywordId = keywordId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}

