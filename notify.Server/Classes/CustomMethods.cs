namespace notify.Server.Classes
{
    public interface ICustomMethods
    {
        void MapProperties<TSource, TDestination>(TSource source, TDestination destination) where TSource : class where TDestination : class;
        List<TDestination> MapList<TSource, TDestination>(List<TSource> sourceList) where TSource : class where TDestination : class, new();
    }
    public class CustomMethods : ICustomMethods
    {
        public void MapProperties<TSource, TDestination>(TSource source, TDestination destination) where TSource : class where TDestination : class
        {
            var sourceProperties = typeof(TSource).GetProperties();
            var destinationProperties = typeof(TDestination).GetProperties();

            foreach (var sourceProperty in sourceProperties)
            {
                var destinationProperty = destinationProperties.FirstOrDefault(p => p.Name == sourceProperty.Name);

                if (destinationProperty != null)
                {
                    destinationProperty.SetValue(destination, sourceProperty.GetValue(source));
                }
            }
        }
        public List<TDestination> MapList<TSource, TDestination>(List<TSource> sourceList) where TSource : class where TDestination : class, new()
        {
            var destinationList = new List<TDestination>();

            foreach (var source in sourceList)
            {
                var destination = new TDestination();
                MapProperties(source, destination);
                destinationList.Add(destination);
            }

            return destinationList;
        }
    }
}
