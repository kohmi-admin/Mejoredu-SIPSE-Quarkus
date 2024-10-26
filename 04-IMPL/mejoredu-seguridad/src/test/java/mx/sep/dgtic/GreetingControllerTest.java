package mx.sep.dgtic;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import javax.naming.Binding;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.*;
import javax.naming.ldap.InitialLdapContext;
import java.util.HashMap;
import java.util.Hashtable;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class GreetingControllerTest {
    /*@Test
    public void testLDAP() throws NamingException {
        var env = new Hashtable<String, Object>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, "ldap://localhost:389/dc=example,dc=com");

        // Authenticate as S. User and password "mysecret"
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, "cn=admin,dc=example,dc=com");
        env.put(Context.SECURITY_CREDENTIALS, "Password123#@!");

        DirContext ctx = new InitialLdapContext(env, null);

        SearchControls searchCtrls = new SearchControls();
        searchCtrls.setSearchScope(SearchControls.SUBTREE_SCOPE);

        String returnAttrs[] = { "uid","email", "mobile", "sn", "cn" };
        searchCtrls.setReturningAttributes(returnAttrs);
        var people = ctx.search("ou=People", "(&(objectClass=*)(uid=hmartinez@ahorra.io))", searchCtrls);

        while (people.hasMoreElements()) {
            SearchResult sr = (SearchResult) people.next();
            var attributes = sr.getAttributes().getAll();

            while (attributes.hasMoreElements()) {
                System.out.println(attributes.next());
            }
            System.out.println("-----------------------");
        }
        ctx.close();
    }*/

}