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
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    private CategoryService categoryService;
    private KeywordService keywordService;
    private ProductService productService;
    public CategoryController(CategoryService categoryService,KeywordService keywordService, ProductService productService) {
        this.categoryService = categoryService;
        this.keywordService = keywordService;
        this.productService = productService;
    }
    @GetMapping("/{categoryId}")
    ResponseEntity<Category> getCategory(@PathVariable Long categoryId) {
        return ResponseEntity.of(categoryService.getCategory(categoryId));
    }
    @PostMapping
    ResponseEntity<Void> createCategory(@Valid @RequestBody Category category) {

        Category createdCategory = categoryService.setCategory(category);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{categoryId}").buildAndExpand(createdCategory.getCategoryId()).toUri();
        return ResponseEntity.created(location).build();
    }
    private List<Keyword> getKeywordsToRemove(List<Keyword> existingKeywords, List<Keyword> newKeywords) {
        Set<Long> newKeywordIds = newKeywords.stream()
                .map(Keyword::getKeywordId)
                .collect(Collectors.toSet());

        return existingKeywords.stream()
                .filter(keyword -> !newKeywordIds.contains(keyword.getKeywordId()))
                .collect(Collectors.toList());
    }
    @PutMapping("/{categoryId}")
    public ResponseEntity<?> updateCategory(@Valid @RequestBody Category newCategory, @PathVariable Long categoryId) {
        return categoryService.getCategory(categoryId)
                .map(oldCategory -> {
                    List<Keyword> keywordsToRemove = getKeywordsToRemove(oldCategory.getKeywords(), newCategory.getKeywords());
                    if (!categoryService.canRemoveKeywords(categoryId, keywordsToRemove)) {
                        return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body("Nie mozna usunac przypisania danych slow kluczowych," +
                                        " poniewaz sa uzywane przez produkty z tej kategorii.");
                    }
                    oldCategory.setName(newCategory.getName());
                    oldCategory.setKeywords(newCategory.getKeywords());
                    categoryService.setCategory(oldCategory);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        return categoryService.getCategory(categoryId).map(category -> {
            categoryService.deleteCategory(categoryId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/byname")
    Page<Category> getCategoriesOrderByName(@RequestParam(name = "page", defaultValue = "0") int page,
                                 @RequestParam(name = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryService.getCategoriesByNameAsc(pageable);
    }
    @GetMapping
    Page<Category> getCategories(@RequestParam(name = "page", defaultValue = "0") int page,
                                 @RequestParam(name = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryService.getCategories(pageable);
    }
    @GetMapping("/bykeyword/{keywordId}")
    Page<Category> getCategoriesByKeyword(@RequestParam(name = "page", defaultValue = "0") int page,
                                 @RequestParam(name = "size", defaultValue = "20") int size,
                                          @PathVariable Long keywordId) {
        Pageable pageable = PageRequest.of(page, size);
        Keyword keyword = keywordService.getKeyword(keywordId).orElseThrow();
        return categoryService.getCategoriesByKeyword(keyword,pageable);
    }
    @GetMapping("/byproduct/{productId}")
    ResponseEntity<Category> getCategoryByProduct(@PathVariable Long productId) {
        Product product = productService.getProduct(productId).orElseThrow();
        Category category = categoryService.getCategoryByProduct(product);
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }

    }
    @GetMapping("/namecheck/{name}")
    ResponseEntity<String> checkCategoryName(@PathVariable String name){
        Optional<Category> category = categoryService.getCategoryByName(name);
        if(category.isPresent()){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("{\"error\":\"Istnieje już kategoria o podanej nazwie.\"}");
        }else{
            return ResponseEntity.ok("Można utworzyć kategorię.");
        }
    }
}
