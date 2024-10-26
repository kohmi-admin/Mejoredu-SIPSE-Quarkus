package mx.sep.dgtic;

import io.quarkus.test.junit.QuarkusTest;

import org.junit.jupiter.api.Disabled;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class GestorCatalogoControllerTest {

    @Disabled
    public void testVersionEndpoint() {
        given()
          .when().get("/api/catalogos/version")
          .then()
             .statusCode(200)
             .body(is("DEV20230725"));
    }

}