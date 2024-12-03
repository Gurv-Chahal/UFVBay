package mainfiles.config;

import mainfiles.entity.Listing;
import mainfiles.entity.User;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("listingSecurity")
public class ListingSecurity {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public ListingSecurity(ListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }


    public boolean isOwner(Authentication authentication, Long listingId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();

        // Fetch the user from the database
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return false;
        }

        // Fetch the listing from the database
        Listing listing = listingRepository.findById(listingId)
                .orElse(null);

        if (listing == null) {
            return false;
        }

        // Compare the listing's owner with the authenticated user
        return listing.getUser().getId().equals(user.getId());
    }
}
