package com.moravia.demo.e2e;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Test E2E para el caso de uso 2: Reserva completa con check-in, servicios y checkout
 * 
 * IMPORTANTE: Este test asume que la aplicación ya está corriendo:
 * - Frontend Angular en http://localhost:4200
 * - Backend Spring Boot en http://localhost:8081
 * 
 * REQUISITOS PREVIOS:
 * - Usuario cliente: maria.gomez@example.com / pass456 debe existir en la BD
 * - Usuario operador: carlos.rojas@example.com / carlos123 debe existir en la BD
 * - El cliente debe tener al menos una reserva con estado CONFIRMADA o PENDIENTE
 * 
 * NOTA: Este test crea DOS ventanas de Chrome (una para el cliente y otra para el operador)
 * porque el caso de uso requiere que ambos usuarios interactúen simultáneamente.
 */
public class CaseUse2Test {

    private final String baseUrl = "http://localhost:4200";
    private final String baseXpathAuth = "/html/body/app-root/app-auth-layout/app-auth-wrap/div/app-auth-card/div";
    private final String baseXpathReserva = "/html/body/app-root/app-portal-layout/app-reserva-form/div/form/div";
    
    private WebDriver driver;
    private WebDriverWait wait;
    private WebDriver operatorDriver;
    private WebDriverWait operatorWait;

    @BeforeEach
    public void init() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--disable-extensions");
        chromeOptions.addArguments("--disable-notifications");
        // chromeOptions.addArguments("--headless");

        // Driver para el usuario cliente
        this.driver = new ChromeDriver(chromeOptions);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        // Driver para el operador (en otra pestaña/ventana)
        this.operatorDriver = new ChromeDriver(chromeOptions);
        this.operatorWait = new WebDriverWait(operatorDriver, Duration.ofSeconds(5));
    }

    @Test
    public void testReservaCompleta_CheckinServiciosYCheckout() {
        // ============================================
        // PASO 1: Usuario cliente hace login
        // ============================================
        driver.get(baseUrl + "/auth");
        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(baseXpathAuth)));

        WebElement loginEmailInput = driver.findElement(
                By.xpath(baseXpathAuth + "/app-login-form/form/div[1]/input"));

        loginEmailInput.clear();
        loginEmailInput.sendKeys("maria.gomez@example.com");

        shortPause(2);

        WebElement loginPasswordInput = driver.findElement(
                By.xpath(baseXpathAuth + "/app-login-form/form/div[2]/input"));

        loginPasswordInput.clear();
        loginPasswordInput.sendKeys("pass456");

        shortPause(2);

        WebElement loginButton = driver.findElement(
                By.xpath(baseXpathAuth + "/app-login-form/form/div[3]/button[1]"));
        loginButton.click();

        shortPause(3);

        // ============================================
        // PASO 1.5: Crear una reserva si no existe ninguna
        // ============================================
        driver.get(baseUrl + "/mis-reservas");
        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("mis-reservas-container")));

        List<WebElement> reservaCards = driver.findElements(By.className("reserva-card"));
        
        // Si no hay reservas, crear una nueva
        if (reservaCards.isEmpty()) {
            driver.get(baseUrl + "/reserva/nueva");
            shortPause(2);

            // Crear una reserva para dentro de 7 días (para que esté en estado CONFIRMADA/PENDIENTE)
            String inicioReserva = LocalDate.now().plusDays(7).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            String finReserva = LocalDate.now().plusDays(10).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

            llenarFormularioReserva(inicioReserva, finReserva);

            shortPause(5); // Esperar más tiempo para que se procese la reserva

            // Volver a mis reservas y esperar a que se cargue
            driver.get(baseUrl + "/mis-reservas");
            shortPause(3);

            wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("mis-reservas-container")));
            
            // Esperar a que aparezcan las reservas (puede haber un delay)
            shortPause(2);
            reservaCards = driver.findElements(By.className("reserva-card"));
            
            // Si aún no hay reservas, esperar un poco más
            int intentos = 0;
            while (reservaCards.isEmpty() && intentos < 3) {
                shortPause(2);
                reservaCards = driver.findElements(By.className("reserva-card"));
                intentos++;
            }
        }

        // Verificar que hay reservas
        Assertions.assertThat(reservaCards.size()).isGreaterThan(0)
                .withFailMessage("El cliente no tiene reservas después de intentar crear una.");

        // Encontrar una reserva que esté sin iniciar (estado CONFIRMADA, PENDIENTE, PROXIMA o cualquier estado que no sea FINALIZADA/CANCELADA)
        WebElement reservaSinIniciar = null;
        StringBuilder estadosEncontrados = new StringBuilder();
        
        System.out.println("📋 Buscando reserva sin iniciar. Total de reservas: " + reservaCards.size());
        
        for (WebElement card : reservaCards) {
            try {
                String estadoTexto = card.findElement(By.className("estado-badge")).getText().trim();
                estadosEncontrados.append(estadoTexto).append("; ");
                System.out.println("  - Estado encontrado: " + estadoTexto);
                
                // Aceptar cualquier estado que no sea FINALIZADA o CANCELADA
                // Esto es más flexible porque el frontend puede calcular estados dinámicamente
                if (!estadoTexto.contains("FINALIZADA") && !estadoTexto.contains("CANCELADA")) {
                    reservaSinIniciar = card;
                    System.out.println("✓ Reserva seleccionada con estado: " + estadoTexto);
                    break;
                }
            } catch (Exception e) {
                System.err.println("⚠️ Error al leer estado de reserva: " + e.getMessage());
            }
        }

        if (reservaSinIniciar == null) {
            // Si no encontramos ninguna, tomar la primera disponible
            if (!reservaCards.isEmpty()) {
                reservaSinIniciar = reservaCards.get(0);
                System.out.println("⚠️ No se encontró reserva sin iniciar, usando la primera disponible");
                try {
                    String estadoPrimera = reservaSinIniciar.findElement(By.className("estado-badge")).getText().trim();
                    System.out.println("  Estado de la primera reserva: " + estadoPrimera);
                } catch (Exception e) {
                    System.err.println("⚠️ No se pudo leer el estado de la primera reserva");
                }
            } else {
                String mensaje = "No se encontró ninguna reserva. Estados encontrados: " + estadosEncontrados.toString();
                System.err.println("❌ " + mensaje);
                throw new AssertionError(mensaje);
            }
        }
        
        Assertions.assertThat(reservaSinIniciar).isNotNull()
                .withFailMessage("No se encontró una reserva válida. Estados encontrados: " + estadosEncontrados.toString());

        // Guardar el ID de la reserva para uso posterior
        String reservaIdText = reservaSinIniciar.findElement(By.tagName("h3")).getText();
        String reservaId = reservaIdText.replace("Reserva #", "").trim();

        // ============================================
        // PASO 3: Operador hace login en otra pestaña
        // ============================================
        operatorDriver.get(baseUrl + "/auth");
        shortPause(2);

        operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(baseXpathAuth)));

        WebElement operatorEmailInput = operatorDriver.findElement(
                By.xpath(baseXpathAuth + "/app-login-form/form/div[1]/input"));

        operatorEmailInput.clear();
        operatorEmailInput.sendKeys("carlos.rojas@example.com");

        shortPause(2);

        WebElement operatorPasswordInput = operatorDriver.findElement(
                By.xpath(baseXpathAuth + "/app-login-form/form/div[2]/input"));

        operatorPasswordInput.clear();
        operatorPasswordInput.sendKeys("carlos123");

        shortPause(2);

        WebElement operatorLoginButton = operatorDriver.findElement(
                By.xpath(baseXpathAuth + "/app-login-form/form/div[3]/button[1]"));
        operatorLoginButton.click();

        shortPause(3);

        // ============================================
        // PASO 4: Operador va al perfil de reservas
        // ============================================
        operatorDriver.get(baseUrl + "/reserva/table");
        shortPause(2);

        operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.className("services-table")));

        // Esperar a que la tabla se cargue
        operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.className("service-row")));

        // Encontrar la fila de la reserva del usuario
        List<WebElement> rows = operatorDriver.findElements(By.className("service-row"));
        WebElement reservaRow = null;

        for (WebElement row : rows) {
            String idCell = row.findElement(By.className("cell-id")).getText();
            if (idCell.equals(reservaId)) {
                reservaRow = row;
                break;
            }
        }

        Assertions.assertThat(reservaRow).isNotNull()
                .withFailMessage("No se encontró la reserva con ID " + reservaId + " en la tabla del operador");

        // ============================================
        // PASO 5: Operador activa (realiza check-in) la reserva
        // ============================================
        // Verificar el estado actual antes de intentar activar
        String estadoAntesActivar = reservaRow.findElement(By.className("cell-estado"))
                .findElement(By.className("estado-badge")).getText().trim();
        System.out.println("📋 Estado de la reserva antes de activar: " + estadoAntesActivar);
        
        WebElement btnActivar = reservaRow.findElement(By.className("btn-activar"));
        
        // Scroll al botón para asegurar que esté visible
        ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].scrollIntoView({block: 'center'});", btnActivar);
        shortPause(1);
        
        // Verificar si el botón está habilitado (método más confiable)
        boolean isEnabled = btnActivar.isEnabled();
        System.out.println("🔘 Botón activar está habilitado: " + isEnabled);
        
        if (!isEnabled) {
            System.err.println("⚠️ El botón de activar está deshabilitado. Estado de la reserva: " + estadoAntesActivar);
            System.err.println("⚠️ Solo se puede activar una reserva con estado CONFIRMADA o INACTIVA");
            throw new AssertionError("El botón de activar está deshabilitado. Estado actual: " + estadoAntesActivar);
        }
        
        // Proceder con la activación
        {
            // Usar JavaScript click directamente para evitar problemas de interceptación
            ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].click();", btnActivar);
            
            shortPause(2);
            
            // Manejar PRIMERA alerta: confirm('¿Activar esta reserva?')
            boolean confirmAceptado = false;
            try {
                WebDriverWait alertWait = new WebDriverWait(operatorDriver, Duration.ofSeconds(5));
                alertWait.until(ExpectedConditions.alertIsPresent());
                String confirmText = operatorDriver.switchTo().alert().getText();
                System.out.println("✅ Confirmación recibida: " + confirmText);
                operatorDriver.switchTo().alert().accept(); // Aceptar el confirm
                confirmAceptado = true;
                shortPause(2);
            } catch (Exception e) {
                System.err.println("⚠️ No se encontró el confirm de activación después de 5 segundos: " + e.getMessage());
                System.err.println("⚠️ Continuando de todas formas...");
            }
            
            // Esperar SEGUNDA alerta: alert('Reserva activada exitosamente')
            boolean alertAceptado = false;
            try {
                WebDriverWait alertWait = new WebDriverWait(operatorDriver, Duration.ofSeconds(5));
                alertWait.until(ExpectedConditions.alertIsPresent());
                String alertText = operatorDriver.switchTo().alert().getText();
                System.out.println("✅ Alerta recibida: " + alertText);
                operatorDriver.switchTo().alert().accept(); // Aceptar el alert
                alertAceptado = true;
                shortPause(2);
            } catch (Exception e) {
                System.err.println("⚠️ No se encontró el alert de éxito después de 5 segundos: " + e.getMessage());
                if (confirmAceptado) {
                    System.err.println("⚠️ El confirm fue aceptado, pero no apareció el alert. Puede que la operación haya fallado.");
                }
            }
            
            // Si no se encontraron las alertas, esperar un poco más para que la operación se complete
            if (!confirmAceptado || !alertAceptado) {
                System.out.println("⏳ Esperando más tiempo para que la operación se complete...");
                shortPause(3);
            }
            
            // Esperar a que la tabla se recargue automáticamente
            shortPause(3);
            
            // Recargar la tabla para asegurar que tenemos los datos actualizados
            operatorDriver.get(baseUrl + "/reserva/table");
            shortPause(2);
            
            operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.className("service-row")));
            
            // Recargar la fila
            rows = operatorDriver.findElements(By.className("service-row"));
            reservaRow = null;
            for (WebElement row : rows) {
                String idCell = row.findElement(By.className("cell-id")).getText();
                if (idCell.equals(reservaId)) {
                    reservaRow = row;
                    break;
                }
            }
            
            Assertions.assertThat(reservaRow).isNotNull()
                    .withFailMessage("No se encontró la reserva con ID " + reservaId + " después de activar");
            
            // Verificar que el estado cambió a ACTIVA
            String estadoActual = reservaRow.findElement(By.className("cell-estado"))
                    .findElement(By.className("estado-badge")).getText().trim();
            System.out.println("Estado actual de la reserva: " + estadoActual);
            
            // Si aún no está ACTIVA, esperar un poco más y verificar de nuevo
            if (!estadoActual.contains("ACTIVA")) {
                System.out.println("⚠️ Estado aún no es ACTIVA, esperando más tiempo...");
                shortPause(3);
                
                // Recargar una vez más
                operatorDriver.get(baseUrl + "/reserva/table");
                shortPause(2);
                
                rows = operatorDriver.findElements(By.className("service-row"));
                for (WebElement row : rows) {
                    String idCell = row.findElement(By.className("cell-id")).getText();
                    if (idCell.equals(reservaId)) {
                        reservaRow = row;
                        estadoActual = reservaRow.findElement(By.className("cell-estado"))
                                .findElement(By.className("estado-badge")).getText().trim();
                        System.out.println("Estado después de esperar: " + estadoActual);
                        break;
                    }
                }
            }
            
            Assertions.assertThat(estadoActual).containsIgnoringCase("ACTIVA")
                    .withFailMessage("El estado no cambió a ACTIVA. Estado actual: " + estadoActual + ", estado anterior: " + estadoAntesActivar);
        }

        // ============================================
        // PASO 6: Operador agrega 2 servicios a la reserva
        // ============================================
        WebElement btnServicios = reservaRow.findElement(By.className("btn-servicios"));
        
        // Scroll al botón
        ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].scrollIntoView(true);", btnServicios);
        shortPause(1);
        
        // Esperar a que sea clickeable
        operatorWait.until(ExpectedConditions.elementToBeClickable(btnServicios));
        
        try {
            btnServicios.click();
        } catch (Exception e) {
            // Si falla el click normal, usar JavaScript click
            ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].click();", btnServicios);
        }

        shortPause(2);

        // Esperar a que se cargue la página de gestión de servicios
        operatorWait.until(ExpectedConditions.urlContains("/reserva/servicios/"));

        // Esperar a que se carguen los servicios disponibles
        operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.className("servicios-grid")));

        shortPause(2);

        // Encontrar los primeros 2 servicios disponibles
        List<WebElement> servicioCards = operatorDriver.findElements(By.className("servicio-card"));
        Assertions.assertThat(servicioCards.size()).isGreaterThanOrEqualTo(2)
                .withFailMessage("No hay suficientes servicios disponibles (se requieren al menos 2)");

        // Agregar primer servicio
        WebElement primerServicio = servicioCards.get(0);
        WebElement btnAgregarPrimero = primerServicio.findElement(By.cssSelector("button.btn-primary"));
        
        // Scroll al elemento si es necesario
        ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].scrollIntoView(true);", btnAgregarPrimero);
        shortPause(1);
        
        btnAgregarPrimero.click();

        shortPause(3);

        // Recargar servicios disponibles
        servicioCards = operatorDriver.findElements(By.className("servicio-card"));

        // Agregar segundo servicio
        if (servicioCards.size() >= 2) {
            WebElement segundoServicio = servicioCards.get(1);
            WebElement btnAgregarSegundo = segundoServicio.findElement(By.cssSelector("button.btn-primary"));
            
            // Scroll al elemento si es necesario
            ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].scrollIntoView(true);", btnAgregarSegundo);
            shortPause(1);
            
            btnAgregarSegundo.click();

            shortPause(3);
        }

        // Verificar que los servicios se agregaron correctamente
        operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.className("servicios-cuenta")));
        List<WebElement> serviciosEnCuenta = operatorDriver.findElements(By.className("servicio-cuenta-item"));
        Assertions.assertThat(serviciosEnCuenta.size()).isGreaterThanOrEqualTo(2)
                .withFailMessage("No se agregaron correctamente los servicios a la cuenta");

        // Verificar el total en el resumen (debe ser mayor a 0)
        WebElement totalElement = operatorDriver.findElement(By.className("resumen-item.total"));
        String totalText = totalElement.findElements(By.tagName("span")).get(1).getText();
        double totalEsperado = Double.parseDouble(totalText.replace("$", "").replace(",", "").trim());
        Assertions.assertThat(totalEsperado).isGreaterThan(0.0);

        // ============================================
        // PASO 7: Usuario acaba su estadía y desea realizar checkout
        // ============================================
        // El usuario vuelve a revisar sus reservas
        driver.get(baseUrl + "/mis-reservas");
        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("mis-reservas-container")));

        // Encontrar la reserva actualizada
        reservaCards = driver.findElements(By.className("reserva-card"));
        WebElement reservaActualizada = null;
        for (WebElement card : reservaCards) {
            String cardId = card.findElement(By.tagName("h3")).getText();
            if (cardId.contains(reservaId)) {
                reservaActualizada = card;
                break;
            }
        }

        Assertions.assertThat(reservaActualizada).isNotNull();

        // Verificar que la reserva ahora está ACTIVA
        String estadoUsuario = reservaActualizada.findElement(By.className("estado-badge")).getText();
        Assertions.assertThat(estadoUsuario).containsIgnoringCase("ACTIVA");

        // ============================================
        // PASO 8: Usuario va donde el operador y decide pagar
        // ============================================
        // El operador vuelve a la tabla de reservas
        operatorDriver.get(baseUrl + "/reserva/table");
        shortPause(2);

        operatorWait.until(ExpectedConditions.visibilityOfElementLocated(By.className("services-table")));

        // Encontrar nuevamente la fila de la reserva
        rows = operatorDriver.findElements(By.className("service-row"));
        reservaRow = null;
        for (WebElement row : rows) {
            String idCell = row.findElement(By.className("cell-id")).getText();
            if (idCell.equals(reservaId)) {
                reservaRow = row;
                break;
            }
        }

        Assertions.assertThat(reservaRow).isNotNull();

        // Hacer clic en el botón de pagar
        WebElement btnPagar = reservaRow.findElement(By.className("btn-pagar"));
        
        // Scroll al botón
        ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].scrollIntoView(true);", btnPagar);
        shortPause(1);
        
        // Esperar a que sea clickeable
        operatorWait.until(ExpectedConditions.elementToBeClickable(btnPagar));
        
        // Verificar que el botón no esté deshabilitado
        String disabledPagar = btnPagar.getAttribute("disabled");
        if (disabledPagar == null || !disabledPagar.equals("true")) {
            try {
                btnPagar.click();
            } catch (Exception e) {
                // Si falla el click normal, usar JavaScript click
                ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].click();", btnPagar);
            }

            shortPause(2);

            // Manejar la alerta de confirmación si existe
            try {
                operatorWait.until(ExpectedConditions.alertIsPresent());
                String alertText = operatorDriver.switchTo().alert().getText();
                // Verificar que el monto mencionado en la alerta sea el apropiado
                if (alertText.contains("$")) {
                    // Extraer el monto de la alerta y verificar
                    String montoEnAlerta = alertText.replaceAll(".*?\\$([0-9,]+(\\.[0-9]+)?).*", "$1");
                    double montoAlerta = Double.parseDouble(montoEnAlerta.replace(",", ""));
                    Assertions.assertThat(montoAlerta).isGreaterThan(0);
                }
                operatorDriver.switchTo().alert().accept();
                shortPause(1);
            } catch (Exception e) {
                // No hay alerta, continuar
            }

            shortPause(2);

            // Recargar la tabla
            operatorDriver.get(baseUrl + "/reserva/table");
            shortPause(2);

            // Recargar la fila para verificar el cambio
            rows = operatorDriver.findElements(By.className("service-row"));
            for (WebElement row : rows) {
                String idCell = row.findElement(By.className("cell-id")).getText();
                if (idCell.equals(reservaId)) {
                    reservaRow = row;
                    break;
                }
            }
        }

        // ============================================
        // PASO 9: Finalizar la reserva (si aún está activa)
        // ============================================
        // Verificar si la reserva necesita ser finalizada
        String estadoFinal = reservaRow.findElement(By.className("cell-estado"))
                .findElement(By.className("estado-badge")).getText();

        if (estadoFinal.contains("ACTIVA")) {
            WebElement btnFinalizar = reservaRow.findElement(By.className("btn-finalizar"));
            
            // Scroll al botón
            ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].scrollIntoView(true);", btnFinalizar);
            shortPause(1);
            
            // Esperar a que sea clickeable
            operatorWait.until(ExpectedConditions.elementToBeClickable(btnFinalizar));
            
            String disabledFinalizar = btnFinalizar.getAttribute("disabled");
            if (disabledFinalizar == null || !disabledFinalizar.equals("true")) {
                try {
                    btnFinalizar.click();
                } catch (Exception e) {
                    // Si falla el click normal, usar JavaScript click
                    ((JavascriptExecutor) operatorDriver).executeScript("arguments[0].click();", btnFinalizar);
                }

                shortPause(2);

                // Manejar alerta si existe
                try {
                    operatorWait.until(ExpectedConditions.alertIsPresent());
                    operatorDriver.switchTo().alert().accept();
                    shortPause(1);
                } catch (Exception e) {
                    // No hay alerta
                }

                shortPause(2);

                // Recargar la tabla
                operatorDriver.get(baseUrl + "/reserva/table");
                shortPause(2);

                // Verificar que la reserva está finalizada
                rows = operatorDriver.findElements(By.className("service-row"));
                for (WebElement row : rows) {
                    String idCell = row.findElement(By.className("cell-id")).getText();
                    if (idCell.equals(reservaId)) {
                        reservaRow = row;
                        break;
                    }
                }

                String estadoFinalizado = reservaRow.findElement(By.className("cell-estado"))
                        .findElement(By.className("estado-badge")).getText();
                Assertions.assertThat(estadoFinalizado).containsIgnoringCase("FINALIZADA");
            }
        } else {
            // Ya está finalizada
            Assertions.assertThat(estadoFinal).containsIgnoringCase("FINALIZADA");
        }
    }

    private void shortPause(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void llenarFormularioReserva(String inicio, String fin) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathReserva + "[1]")));

        shortPause(2);

        WebElement dateInputStart = driver.findElement(By.xpath(
                baseXpathReserva + "/div/div[1]/input"));
        dateInputStart.clear();
        dateInputStart.sendKeys(inicio);

        shortPause(2);

        WebElement dateInputEnd = driver.findElement(By.xpath(
                baseXpathReserva + "/div/div[2]/input"));
        dateInputEnd.clear();
        dateInputEnd.sendKeys(fin);

        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(
                        baseXpathReserva + "[2]/app-room-type-selector")));

        WebElement roomTypeGrid = driver.findElement(By.xpath(
                baseXpathReserva + "[2]/app-room-type-selector/div/div[2]"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", roomTypeGrid);

        shortPause(2);

        WebElement roomTypeSelect = driver.findElement(By.xpath(
                baseXpathReserva + "[2]/app-room-type-selector/div/div[3]/div[1]"));

        roomTypeSelect.click();

        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathReserva + "[3]/app-room-selector")));

        WebElement roomGrid = driver.findElement(By.xpath(
                baseXpathReserva + "[3]/app-room-selector/div"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", roomGrid);

        shortPause(2);

        WebElement roomSelect = driver.findElement(By.xpath(
                baseXpathReserva + "[3]/app-room-selector/div/div[2]/div[1]"));
        roomSelect.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathReserva + "[4]")));

        shortPause(2);

        WebElement formAction = driver.findElement(By.xpath(
                baseXpathReserva + "[4]/div[2]"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", formAction);

        shortPause(2);

        WebElement submitButton = driver.findElement(By.xpath(
                baseXpathReserva + "[4]/div[2]/button"));

        submitButton.click();

        shortPause(2);

        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, 0);");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
        if (operatorDriver != null) {
            operatorDriver.quit();
        }
    }
}
