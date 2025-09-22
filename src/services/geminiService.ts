import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recipe, SearchFilters, Ingredient } from '../types';

// Initialize Gemini AI - In a real app, this would come from environment variables
const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY'); // Users will need to replace this

export async function findRecipes(
  filters: SearchFilters,
  pantryIngredients: Ingredient[]
): Promise<Recipe[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const pantryList = pantryIngredients.map(ing => ing.name).join(', ');
    const dietaryRestrictions = filters.dietaryPreferences.join(', ');

    const prompt = `
Actúa como un experto nutricionista y chef. Tu tarea es generar exactamente 3 recetas saludables que cumplan con los siguientes criterios:

CRITERIOS DE BÚSQUEDA:
- Tipo de comida: ${filters.mealType}
- Ingrediente principal/requerido: ${filters.ingredientQuery}
- Preferencias dietéticas: ${dietaryRestrictions || 'Ninguna'}

INGREDIENTES DISPONIBLES EN LA DESPENSA:
${pantryList || 'No hay ingredientes específicos en la despensa'}

INSTRUCCIONES ESPECÍFICAS:
1. Prioriza el uso de ingredientes de la despensa cuando sea posible
2. Cada receta debe ser saludable y equilibrada nutricionalmente
3. Incluye el ingrediente principal/requerido si se especificó
4. Respeta las preferencias dietéticas indicadas
5. Proporciona recetas variadas y atractivas

FORMATO DE RESPUESTA:
Devuelve EXACTAMENTE un array JSON con 3 objetos de recetas. Cada receta debe incluir:
- title: Nombre atractivo de la receta
- description: Descripción breve y apetitosa (máximo 100 caracteres)
- prepTime: Tiempo de preparación en minutos (número)
- ingredients: Array de objetos con "name" y "quantity"
- steps: Array de pasos de preparación (máximo 6 pasos)
- dietaryInfo: Array de información dietética (ej: ["Vegano", "Sin Gluten"])
- healthBenefits: Array de beneficios para la salud (máximo 3)
- isAIGenerated: siempre true
- imagePrompt: Descripción en inglés para generar imagen de la receta

Responde ÚNICAMENTE con el JSON válido, sin texto adicional.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const recipes = JSON.parse(text) as Recipe[];
      return recipes;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Error procesando la respuesta de la IA');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Return mock data for demo purposes when API is not configured
    return getMockRecipes(filters);
  }
}

// Mock data for when API key is not configured
function getMockRecipes(filters: SearchFilters): Recipe[] {
  const mockRecipes: Recipe[] = [
    {
      title: "Bowl de Quinoa con Aguacate",
      description: "Nutritivo bowl lleno de proteínas y grasas saludables",
      prepTime: 20,
      ingredients: [
        { name: "Quinoa", quantity: "1 taza" },
        { name: "Aguacate", quantity: "1 unidad" },
        { name: "Espinaca", quantity: "2 tazas" },
        { name: "Tomates cherry", quantity: "1/2 taza" }
      ],
      steps: [
        "Cocinar la quinoa según las instrucciones del paquete",
        "Lavar y preparar las verduras",
        "Cortar el aguacate en cubos",
        "Mezclar todos los ingredientes en un bowl",
        "Aliñar con limón y aceite de oliva",
        "Servir inmediatamente"
      ],
      dietaryInfo: ["Vegano", "Sin Gluten", "Alto en Proteína"],
      healthBenefits: ["Rico en proteínas completas", "Alto contenido de fibra", "Grasas saludables"],
      isAIGenerated: true,
      imagePrompt: "Colorful quinoa bowl with avocado, spinach and cherry tomatoes, healthy food photography"
    },
    {
      title: "Salmón con Vegetales al Vapor",
      description: "Plato rico en omega-3 con vegetales frescos y coloridos",
      prepTime: 25,
      ingredients: [
        { name: "Filete de salmón", quantity: "150g" },
        { name: "Brócoli", quantity: "1 taza" },
        { name: "Zanahorias", quantity: "2 unidades" },
        { name: "Limón", quantity: "1/2 unidad" }
      ],
      steps: [
        "Precalentar el horno a 200°C",
        "Sazonar el salmón con limón y hierbas",
        "Cortar los vegetales en trozos uniformes",
        "Cocinar al vapor los vegetales por 10 minutos",
        "Hornear el salmón por 12-15 minutos",
        "Servir caliente con los vegetales"
      ],
      dietaryInfo: ["Alto en Proteína", "Keto", "Bajo en Carbohidratos"],
      healthBenefits: ["Rico en Omega-3", "Alto contenido proteico", "Antioxidantes naturales"],
      isAIGenerated: true,
      imagePrompt: "Grilled salmon with steamed colorful vegetables, healthy dinner plate, natural lighting"
    },
    {
      title: "Smoothie Verde Energético",
      description: "Bebida refrescante llena de vitaminas y minerales",
      prepTime: 5,
      ingredients: [
        { name: "Espinaca", quantity: "1 taza" },
        { name: "Plátano", quantity: "1 unidad" },
        { name: "Manzana verde", quantity: "1/2 unidad" },
        { name: "Jengibre", quantity: "1 cm" }
      ],
      steps: [
        "Lavar bien las hojas de espinaca",
        "Pelar el plátano y cortar en trozos",
        "Cortar la manzana en cubos",
        "Agregar todos los ingredientes a la licuadora",
        "Licuar hasta obtener consistencia suave",
        "Servir inmediatamente bien frío"
      ],
      dietaryInfo: ["Vegano", "Sin Gluten", "Bajo en Calorías"],
      healthBenefits: ["Alto en vitaminas", "Detox natural", "Energía instantánea"],
      isAIGenerated: true,
      imagePrompt: "Green smoothie in glass with fresh spinach, banana and apple, healthy drink photography"
    }
  ];

  return mockRecipes;
}