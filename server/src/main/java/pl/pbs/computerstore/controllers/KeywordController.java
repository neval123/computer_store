package pl.pbs.computerstore.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.service.CategoryService;
import pl.pbs.computerstore.service.KeywordService;
import pl.pbs.computerstore.service.ProductService;

import java.net.URI;

@RestController
@RequestMapping("/api/keyword")
public class KeywordController {
    private KeywordService keywordService;
    private CategoryService categoryService;
    private ProductService productService;
    public KeywordController(KeywordService keywordService, CategoryService categoryService,ProductService productService){
        this.keywordService = keywordService;
        this.categoryService = categoryService;
        this.productService = productService;
    }
    @GetMapping("/{keywordId}")
        ResponseEntity<Keyword> getKeyword(@PathVariable Long keywordId) {
        return ResponseEntity.of(keywordService.getKeyword(keywordId));
    }
    @PostMapping
    ResponseEntity<Void> createKeyword(@Valid @RequestBody Keyword keyword) {

        Keyword createdKeyword = keywordService.setKeyword(keyword);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{keywordId}").buildAndExpand(createdKeyword.getKeywordId()).toUri();
        return ResponseEntity.created(location).build();
    }
    @PutMapping("/{keywordId}")
    public ResponseEntity<Void> updateKeyword(@Valid @RequestBody Keyword keyword,
                                               @PathVariable Long keywordId) {
        return keywordService.getKeyword(keywordId)
                .map(oldKeyword -> {
                    keywordService.setKeyword(keyword);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{keywordId}")
    public ResponseEntity<Void> deleteKeyword(@PathVariable Long keywordId) {
        return keywordService.getKeyword(keywordId).map(keyword -> {
            keywordService.deleteKeyword(keywordId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/byname")
    Page<Keyword> getKeywordsOrderByName(@RequestParam(name = "page", defaultValue = "0") int page,
                                            @RequestParam(name = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return keywordService.getKeywordsByNameAsc(pageable);
    }
    @GetMapping
    Page<Keyword> getKeywords(@RequestParam(name = "page", defaultValue = "0") int page,
                                 @RequestParam(name = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return keywordService.getKeywords(pageable);
    }
    @GetMapping("/bycategory/{categoryId}")
    Page<Keyword> getKeywordsByCategory(@RequestParam(name = "page", defaultValue = "0") int page,
                              @RequestParam(name = "size", defaultValue = "1000") int size,
                                        @PathVariable Long categoryId) {
        Pageable pageable = PageRequest.of(page, size);
        Category c = categoryService.getCategory(categoryId).orElseThrow();
        return keywordService.getKeywordsByCategory(c,pageable);
    }
    @GetMapping("/byproduct/{productId}")
    Page<Keyword> getKeywordsByProduct(@RequestParam(name = "page", defaultValue = "0") int page,
                                        @RequestParam(name = "size", defaultValue = "1000") int size,
                                        @PathVariable Long productId) {
        Pageable pageable = PageRequest.of(page, size);
        Product p = productService.getProduct(productId).orElseThrow();
        return keywordService.getKeywordsByProduct(p,pageable);
    }
}
