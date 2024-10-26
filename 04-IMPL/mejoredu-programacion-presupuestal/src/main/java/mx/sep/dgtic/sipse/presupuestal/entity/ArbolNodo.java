package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "met_arbol_nodo")
public class ArbolNodo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_arbol_nodo")
  private Integer idArbolNodo;
  @ManyToOne
  @JoinColumn(name = "id_arbol", referencedColumnName = "id_arbol", updatable = false, insertable = false)
  private Arbol arbol;
  @Column(name = "id_arbol")
  private Integer idArbol;
  @ManyToOne
  @JoinColumn(name = "id_nodo_padre", referencedColumnName = "id_arbol_nodo", updatable = false, insertable = false)
  private ArbolNodo arbolNodoPadre;
  @Column(name = "id_nodo_padre")
  private Integer idNodoPadre;
  @Column(name = "cx_descripcion")
  private String cxDescripcion;
  @Column(name = "cx_clave")
  private String cxClave;
  @Column(name = "ix_tipo")
  private Integer ixTipo;

  @OneToOne
  @JoinColumn(name = "id_espejo", referencedColumnName = "id_arbol_nodo", updatable = false, insertable = false)
  private ArbolNodo espejoPadre;

  @OneToOne(mappedBy = "espejoPadre")
  private ArbolNodo espejoHijo;

  @Column(name = "id_espejo")
  private Integer idEspejo;

  @OneToMany(mappedBy = "arbolNodoPadre", fetch = FetchType.EAGER)
  private Set<ArbolNodo> nodosHijos = new HashSet<>();
  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "id_indicador_resultado", referencedColumnName = "id_indicador_resultado", updatable = false, insertable = false)
  private IndicadorResultado indicadorResultado;
  @Column(name = "id_indicador_resultado")
  private Integer idIndicadorResultado;

  public Set<ArbolNodo> getNodosHijos() {
    return nodosHijos;
  }

  public void setNodosHijos(Set<ArbolNodo> nodosHijos) {
    this.nodosHijos = nodosHijos;
  }

  public Integer getIdArbolNodo() {
    return idArbolNodo;
  }

  public void setIdArbolNodo(Integer idArbolNodo) {
    this.idArbolNodo = idArbolNodo;
  }

  public Arbol getArbol() {
    return arbol;
  }

  public void setArbol(Arbol arbol) {
    this.arbol = arbol;
  }

  public Integer getIdArbol() {
    return idArbol;
  }

  public void setIdArbol(Integer idArbol) {
    this.idArbol = idArbol;
  }

  public ArbolNodo getArbolNodoPadre() {
    return arbolNodoPadre;
  }

  public void setArbolNodoPadre(ArbolNodo arbolNodoPadre) {
    this.arbolNodoPadre = arbolNodoPadre;
  }

  public Integer getIdNodoPadre() {
    return idNodoPadre;
  }

  public void setIdNodoPadre(Integer idNodoPadre) {
    this.idNodoPadre = idNodoPadre;
  }

  public String getCxDescripcion() {
    return cxDescripcion;
  }

  public void setCxDescripcion(String cxDescripcion) {
    this.cxDescripcion = cxDescripcion;
  }

  public String getCxClave() {
    return cxClave;
  }

  public void setCxClave(String cxClave) {
    this.cxClave = cxClave;
  }

  public Integer getIxTipo() {
    return ixTipo;
  }

  public void setIxTipo(Integer ixTipo) {
    this.ixTipo = ixTipo;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    ArbolNodo arbolNodo = (ArbolNodo) o;
    return getIdArbolNodo() != null && Objects.equals(getIdArbolNodo(), arbolNodo.getIdArbolNodo());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idArbolNodo = " + idArbolNodo + ")";
  }

  public ArbolNodo getEspejoPadre() {
    return espejoPadre;
  }

  public void setEspejoPadre(ArbolNodo espejoPadre) {
    this.espejoPadre = espejoPadre;
  }

  public ArbolNodo getEspejoHijo() {
    return espejoHijo;
  }

  public void setEspejoHijo(ArbolNodo espejoHijo) {
    this.espejoHijo = espejoHijo;
  }

  public Integer getIdEspejo() {
    return idEspejo;
  }

  public void setIdEspejo(Integer idEspejo) {
    this.idEspejo = idEspejo;
  }

  public IndicadorResultado getIndicadorResultado() {
    return indicadorResultado;
  }

  public void setIndicadorResultado(IndicadorResultado indicadorResultado) {
    this.indicadorResultado = indicadorResultado;
  }

  public Integer getIdIndicadorResultado() {
    return idIndicadorResultado;
  }

  public void setIdIndicadorResultado(Integer idIndicadorResultado) {
    this.idIndicadorResultado = idIndicadorResultado;
  }
}
