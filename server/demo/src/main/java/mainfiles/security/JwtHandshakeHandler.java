package mainfiles.security;

import mainfiles.security.JwtToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Component
public class JwtHandshakeHandler implements HandshakeInterceptor {

    @Autowired
    private JwtToken jwtToken;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        String query = request.getURI().getQuery();
        if (query != null) {
            Map<String, List<String>> queryParams = UriComponentsBuilder.fromUriString("?" + query).build().getQueryParams();
            List<String> tokenList = queryParams.get("token");

            if (tokenList != null && !tokenList.isEmpty()) {
                String token = tokenList.get(0);
                System.out.println("Received token: " + token); // Logging
                if (jwtToken.validateToken(token)) {
                    String username = jwtToken.getUsername(token);
                    System.out.println("Authenticated username: " + username); // Logging
                    attributes.put("username", username);
                    return true;
                } else {
                    System.out.println("Invalid token");
                }
            } else {
                System.out.println("No token found in query params");
            }
        } else {
            System.out.println("No query params in handshake request");
        }
        return false; // Reject handshake if token is invalid
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // No additional action needed after handshake
    }
}
