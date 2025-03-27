package pl.pbs.computerstore.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.repository.KeywordRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
@SpringBootTest
public class KeywordServiceTest {
    @MockBean
    private KeywordRepository mockKeywordRepository;
    @Autowired
    private KeywordService keywordService;
    @Test
    public void setKeywordTest() throws Exception {
        Keyword keyword = new Keyword();
        keyword.setName("Wyprzedaz");
        when(mockKeywordRepository.save(any(Keyword.class))).thenReturn(keyword);
        Keyword keywordSaved = keywordService.setKeyword(keyword);
        assertEquals(keyword,keywordSaved);
    }
    @Test
    public void getKeywordTest() throws Exception {
        Keyword keyword = new Keyword();
        keyword.setName("Wyprzedaz");
        keyword.setKeywordId(1L);
        when(mockKeywordRepository.findById(any(Long.class))).thenReturn(Optional.of(keyword));
        Optional<Keyword> keywordSaved = keywordService.getKeyword(1L);
        assertEquals(keyword.getName(),keywordSaved.get().getName());
    }
    @Test
    public void deleteKeywordTest() throws Exception{
        Long keywordId = 1L;
        keywordService.deleteKeyword(keywordId);
        verify(mockKeywordRepository).deleteById(keywordId);
    }
}
