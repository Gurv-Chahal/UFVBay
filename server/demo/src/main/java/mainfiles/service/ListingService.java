package mainfiles.service;

/*
    Look at AuthService comments for explanation of how this class works. Not the same but similar idea
 */



import mainfiles.dto.ListingDTO;
import java.util.List;

public interface ListingService {

    ListingDTO createListing(ListingDTO listingDTO);
    ListingDTO getListingById(Long id);
    List<ListingDTO> getAllListings();
    ListingDTO updateListing(Long id, ListingDTO listingDTO);
    void deleteListing(Long id);
    List<ListingDTO> getListingsByUserId(Long userId);

}
