package mainfiles.service.Implementation;

import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.entity.Listing;
import mainfiles.mapper.ListingMapper;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import mainfiles.service.ListingService;
import mainfiles.utility.UserUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import mainfiles.entity.User;


@Service
@AllArgsConstructor
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final UserUtil userUtil;


    @Override
    public ListingDTO createListing(ListingDTO listingDTO) {
        // Retrieve the user (you need to implement getCurrentUserId())
        Long currentUserId = userUtil.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + currentUserId));

        // Map DTO to entity
        Listing listing = ListingMapper.mapToCreateListing(listingDTO, user);

        // Save entity to database
        Listing savedListing = listingRepository.save(listing);

        // Map entity back to DTO
        return ListingMapper.mapToCreateListingDTO(savedListing);

    }

    @Override
    public ListingDTO getListingById(Long id) {
        // Find listing by ID
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        // Map entity to DTO
        return ListingMapper.mapToCreateListingDTO(listing);
    }

    @Override
    public List<ListingDTO> getAllListings() {
        // Retrieve all listings
        List<Listing> listings = listingRepository.findAll();

        // Map entities to DTOs
        return listings.stream()
                .map(ListingMapper::mapToCreateListingDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ListingDTO updateListing(Long id, ListingDTO listingDTO) {
        // Find existing listing
        Listing existingListing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        // Update fields
        existingListing.setTitle(listingDTO.getTitle());
        existingListing.setSubject(listingDTO.getSubject());
        existingListing.setAmount(listingDTO.getAmount());
        existingListing.setDescription(listingDTO.getDescription());
        existingListing.setImages(listingDTO.getImages()); // Update images


        // Save updated listing
        Listing updatedListing = listingRepository.save(existingListing);

        // Map entity to DTO
        return ListingMapper.mapToCreateListingDTO(updatedListing);
    }

    @Override
    public void deleteListing(Long id) {
        // Check if listing exists
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        // Delete listing
        listingRepository.delete(listing);
    }
}
