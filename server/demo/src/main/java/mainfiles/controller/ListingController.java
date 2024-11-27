package mainfiles.controller;

import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.dto.UserDTO;
import mainfiles.entity.User;
import mainfiles.mapper.UserMapper;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import mainfiles.service.ListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import mainfiles.utility.UserUtil;

// to access createlisting make sure to put JWT token from logging in into the bearer token field for createlisting api
// this way it associates the jwt token for an account to a listing

@RestController
@RequestMapping("/api/listings")
@CrossOrigin("*")
@AllArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final UserUtil userUtil;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ListingDTO> createListing(@RequestBody ListingDTO listingDTO) {
        ListingDTO createdListing = listingService.createListing(listingDTO);
        return new ResponseEntity<>(createdListing, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListingById(@PathVariable Long id) {
        ListingDTO listing = listingService.getListingById(id);
        return new ResponseEntity<>(listing, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ListingDTO>> getAllListings() {
        List<ListingDTO> listings = listingService.getAllListings();
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingDTO> updateListing(@PathVariable Long id, @RequestBody ListingDTO listingDTO) {
        ListingDTO updatedListing = listingService.updateListing(id, listingDTO);
        return new ResponseEntity<>(updatedListing, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return new ResponseEntity<>("Listing deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ListingDTO>> getUserListings() {
        Long currentUserId = userUtil.getCurrentUserId();
        List<ListingDTO> listings = listingService.getListingsByUserId(currentUserId);
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @GetMapping("/userinfo")
    public ResponseEntity<UserDTO> getUserInfo() {

        // extract user ID from the JWT token
        Long userId = userUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // map user entity to UserDTO
        UserDTO userDTO = UserMapper.mapToUserDTO(user);
        return ResponseEntity.ok(userDTO);
    }

}
