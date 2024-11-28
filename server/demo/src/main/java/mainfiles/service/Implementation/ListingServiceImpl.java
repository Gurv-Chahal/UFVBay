package mainfiles.service.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.entity.Listing;
import mainfiles.mapper.ListingMapper;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import mainfiles.service.ListingService;
import mainfiles.utility.UserUtil;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import mainfiles.entity.User;
import org.springframework.web.multipart.MultipartFile;


@Service
@AllArgsConstructor
public class ListingServiceImpl implements ListingService {

    // fields are injected into Spring context using constructor injection
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final UserUtil userUtil;
    private final Cloudinary cloudinary;


    // Create Listing implementation
    @Override
    public ListingDTO createListing(ListingDTO listingDTO, MultipartFile[] images) throws Exception {

        // 1.Get current user
        Long currentUserId = userUtil.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + currentUserId));

        // 2.Handle image uploads
        // Hold a list of image Urls in an arraylist of type string
        List<String> imageUrls = new ArrayList<>();

        // check to see if there are images to upload (i.e not null and > 0)
        if (images != null && images.length > 0) {

            // using a for each loop, iterate over each image
            for (MultipartFile image : images) {

                // make sure image file is not empty
                if (!image.isEmpty()) {
                    try {
                        // Upload image to Cloudinary
                        Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                        // extract the url and store it in database
                        String imageUrl = uploadResult.get("secure_url").toString();
                        // add the url to imageUrls arraylist
                        imageUrls.add(imageUrl);
                    } catch (IOException e) {
                        // throw exception if image fails to upload
                        throw new Exception("Failed to upload image: " + image.getOriginalFilename(), e);
                    }
                }
            }
        }

        // pass the arraylist of image url strings to listingDTO object
        listingDTO.setImageUrls(imageUrls);

        // Map DTO to entity
        Listing listing = ListingMapper.mapToCreateListing(listingDTO, user);

        // now that its an entity type again it can be saved to the database
        Listing savedListing = listingRepository.save(listing);

        // Map entity back to DTO so it can be returned back to the frontend
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
        existingListing.setImages(listingDTO.getImageUrls());


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
