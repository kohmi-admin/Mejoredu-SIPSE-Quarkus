package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "met_anho_planeacion")
public class AnhoPlaneacion {
  /**
   * Primary key.
   */
  protected static final String PK = "id_anhio";
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_anhio", unique = true, nullable = true)
  private Integer idAnhio;
  @Column(name = "cs_estatus", nullable = false)
  private String csEstatus;
  @Column(name = "df_baja", nullable = true)
  private Date dfBaja;

  public String getCsEstatus() {
    return csEstatus;
  }

  public void setCsEstatus(String csEstatus) {
    this.csEstatus = csEstatus;
  }

  public Integer getIdAnhio() {
    return idAnhio;
  }

  public void setIdAnhio(Integer idAnhio) {
    this.idAnhio = idAnhio;
  }

}