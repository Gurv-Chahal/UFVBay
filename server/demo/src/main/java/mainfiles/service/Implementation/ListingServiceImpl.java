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
        Long currentUserId = userUtil.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + currentUserId));

        Listing listing = ListingMapper.mapToCreateListing(listingDTO, user);

        Listing savedListing = listingRepository.save(listing);

        return ListingMapper.mapToCreateListingDTO(savedListing);

    }

    @Override
    public ListingDTO getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        return ListingMapper.mapToCreateListingDTO(listing);
    }

    @Override
    public List<ListingDTO> getAllListings() {
        List<Listing> listings = listingRepository.findAll();

        return listings.stream()
                .map(ListingMapper::mapToCreateListingDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ListingDTO updateListing(Long id, ListingDTO listingDTO) {
        Listing existingListing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        existingListing.setTitle(listingDTO.getTitle());
        existingListing.setSubject(listingDTO.getSubject());
        existingListing.setAmount(listingDTO.getAmount());
        existingListing.setDescription(listingDTO.getDescription());
        existingListing.setImages(listingDTO.getImages());


        Listing updatedListing = listingRepository.save(existingListing);

        return ListingMapper.mapToCreateListingDTO(updatedListing);
    }

    @Override
    public void deleteListing(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        listingRepository.delete(listing);
    }


    @Override
    public List<ListingDTO> getListingsByUserId(Long userId) {
        List<Listing> listings = listingRepository.findByUserId(userId);
        return listings.stream()
                .map(ListingMapper::mapToCreateListingDTO)
                .collect(Collectors.toList());
    }

}
